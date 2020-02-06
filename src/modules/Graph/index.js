import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_SERVICES, GET_APP_DATA } from 'utils/queries';

import { TextStepModel } from './components/CustomSteps/BotSteps/TextStep/TextStepModel';
import { ButtonStepModel } from './components/CustomSteps/BranchSteps/ButtonStep/ButtonStepModel';
import { ConditionEntityStepModel } from './components/CustomSteps/BranchSteps/ConditionEntityStep/ConditionEntityStepModel';
import { ConditionMessageStepModel } from './components/CustomSteps/BranchSteps/ConditionMessageStep/ConditionMessageStepModel';
import { StartStepModel } from './components/CustomSteps/NavigationSteps/StartStep/StartStepModel';
import { EndStepModel } from './components/CustomSteps/NavigationSteps/EndStep/EndStepModel';

import { CustomDiagramWidget } from './components/CustomGraph/CustomDiagramWidget';

import { engine, model } from './config';

import {
  useGiveEditedState,
  useStepEditing,
  useGraphStructure,
  useCreateStepDataByType,
  useUpdateTextStepToGraph,
  useUpdateConditionEntityToGraph,
  useUpdateButtonStepToGraph,
  useUpdateStartEndStepToGraph,
  useUpdateStep,
  useUpdateSelected,
  useDeleteNode,
  useStartEndUpdate,
  useEdge
} from './hooks';

import { ArrowHead } from './components/Common/ArrowHead';
import { useTranslation } from 'react-i18next';
import { convertStepJsonDataToGraphData, combineUsedEntity } from 'utils/helpers';

import { debounce } from 'lodash';
import { settings } from '../../config/setting';
import { linkToEdge, isntChangeEdge } from './helpers';
import { useApolloClient } from 'react-apollo';

const Graph = ({ forceUpdate }) => {
  const [t] = useTranslation();
  const [newNode, setNewNode] = useState();
  const [steps, edges, entities] = useGraphStructure();
  const apolloClient = useApolloClient();
  const {
    data: {
      addNodes,
      editNodes,
      deleteNodes,
      nodeSelecteds,
      portOutNameSelected,
      DragablePartScreen,
      Show: { SettingPanel, SimulatorPanel, StepSettingType },
      stepEditing,
      SwitchStepSetting,
      userReply: { NodeEdit, isGetUserReply, isSaveUserReply },
      stepAndNodeIdMapping
    },
    client
  } = useQuery(GET_APP_DATA);
  const {
    data: {
      editorService: { id: editorServiceId }
    }
  } = useQuery(GET_SERVICES);
  const updateNode = useUpdateStep(model);
  const updateSelected = useUpdateSelected(model);
  const deleteNode = useDeleteNode(model);
  const createStepDataByType = useCreateStepDataByType();
  const startEndUpdate = useStartEndUpdate(model);
  // eslint-disable-next-line no-unused-vars
  const [saveEdge, deleteEdge] = useEdge();
  const updateStartEndStepGraph = useUpdateStartEndStepToGraph();
  const updateTextStepGraph = useUpdateTextStepToGraph();
  const updateConditionEntityStepGraph = useUpdateConditionEntityToGraph();
  const updateButtonStepGraph = useUpdateButtonStepToGraph();
  useGiveEditedState(model);
  useStepEditing(newNode);
  editorServiceId &&
    model.addListener({
      linksUpdated: event => {
        const { link } = event;
        const edge = linkToEdge(link);
        const linkInModel = model.getLink(link.id);
        if (!linkInModel || isntChangeEdge(edges, edge)) {
          return;
        }
        if (!link.edgeId && edge && edge.targetStepId) {
          saveEdge({ edge, link });
        }
        if (typeof Object.values(link.listeners)[0].targetPortChanged === 'function') {
          return;
        }
        link.addListener({
          targetPortChanged: event => {
            const { entity } = event;
            const edge = linkToEdge(entity);
            const linkInModel = model.getLink(entity.id);
            if (!linkInModel || isntChangeEdge(edges, edge)) {
              return;
            }
            saveEdge({ edge, link: entity });
          }
          // Not need for current spec, this is event for remove edge in BE
          // entityRemoved: event => {
          //   const { entity } = event;
          //   deleteEdge(entity.edgeId);
          // }
        });
      }
    });

  useEffect(() => {
    if (steps && steps.length) {
      combineUsedEntity(steps, entities || [], apolloClient);
    }
  }, [steps, entities, apolloClient]);

  const createNewNode = useCallback(
    step => {
      let stepModel = null;
      switch (step.type) {
        case 'Start':
          stepModel = new StartStepModel(step);
          break;
        case 'Text':
          stepModel = new TextStepModel(step);
          break;
        case 'Button':
          stepModel = new ButtonStepModel(step);
          break;
        case 'ConditionEntity':
          stepModel = new ConditionEntityStepModel(step);
          break;
        case 'ConditionMessage':
          stepModel = new ConditionMessageStepModel(step);
          break;
        default:
          stepModel = new EndStepModel(step);
      }

      stepModel.addListener({
        selectionChanged: function() {
          updateSelected();
        },
        positionChanged: debounce(data => {
          const step = data.entity.serialize();
          let { x, y, position } = step;
          if (!position) {
            position = { x, y };
          }
          if (step.stepId && !(x === position.x && y === position.y)) {
            position = { x, y };
            step.isDragging = true;
            updateNode(step);
          }
        }, settings.delayTimeUpdatePosition)
      });

      return stepModel;
    },
    [updateNode, updateSelected]
  );

  const updateCurrentNodeInGraph = useCallback(
    (updatedNode, step) => {
      const idMapping = JSON.parse(stepAndNodeIdMapping);
      let nodeModel = model.getNode(idMapping[step.id]);

      switch (step.type) {
        case 'Text':
          return updateTextStepGraph(nodeModel, updatedNode, step);
        case 'Button':
          return updateButtonStepGraph(nodeModel, updatedNode, step);
        case 'ConditionEntity':
          return updateConditionEntityStepGraph(nodeModel, updatedNode, step);
        case 'Start':
        case 'End':
          return updateStartEndStepGraph(nodeModel, step);
        default:
          break;
      }
    },
    [
      stepAndNodeIdMapping,
      updateStartEndStepGraph,
      updateTextStepGraph,
      updateButtonStepGraph,
      updateConditionEntityStepGraph
    ]
  );

  const isBranchStep = useCallback(type => {
    return ['Button', 'ConditionEntity', 'ConditionMessage'].includes(type);
  }, []);

  useEffect(() => {
    const isGraphPainted = !!Object.values(model.getNodes()).length;
    let mappingSteps = {};
    let stepNodeIdMapping = JSON.parse(stepAndNodeIdMapping);
    let links = [];

    steps.forEach(step => {
      const stepGraph = convertStepJsonDataToGraphData(step, t, entities);
      let newGraphNode;

      if (isGraphPainted && stepNodeIdMapping[step.id]) {
        newGraphNode = updateCurrentNodeInGraph(stepGraph, step);
      } else {
        newGraphNode = createNewNode(stepGraph);
        newGraphNode.setPosition(stepGraph.position.x, stepGraph.position.y);
        stepNodeIdMapping[stepGraph.stepId] = newGraphNode.id;
      }
      mappingSteps[stepGraph.stepId] = newGraphNode;
    });

    edges.forEach(edge => {
      const sourceStep = mappingSteps[edge.sourceStepId];
      const targetStep = mappingSteps[edge.targetStepId];
      if (!(sourceStep && targetStep)) return;

      const portIn = targetStep.getPort('portIn');
      let portOut = sourceStep.getPort('portOut');

      if (sourceStep.type === 'Button' && edge.isAllBranchSameFlow) {
        portOut = sourceStep.getPort('childPortOutAll');
      } else if (isBranchStep(sourceStep.type)) {
        if (edge.branchSourceStepId !== null) {
          portOut = sourceStep.getPort(`childPortOut${edge.branchSourceStepId}`);
        } else if (edge.isCustomizeFlowElse) {
          portOut = sourceStep.getPort(`childPortOutElse`);
        } else {
          portOut = null;
        }
      }

      if (portOut && portIn && !Object.values(portOut.links).length) {
        const link = portOut.link(portIn);
        link.edgeId = edge.id;
        links.push(link);
      }
    });

    model.addAll(...Object.values(mappingSteps), ...links);
    client.writeData({
      data: { stepAndNodeIdMapping: JSON.stringify(stepNodeIdMapping) }
    });
    setTimeout(() => {
      engine.repaintCanvas();
    }, 200);
  }, [entities, isBranchStep, edges, steps, t, stepAndNodeIdMapping, client, createNewNode, updateCurrentNodeInGraph]);

  useEffect(() => engine.repaintCanvas(), [
    DragablePartScreen,
    SettingPanel,
    SimulatorPanel,
    StepSettingType,
    stepEditing,
    SwitchStepSetting
  ]);

  useEffect(() => {
    // TO DO: Change flow, Move this operation to a function and execute whenever save step
    if (addNodes.length > 0 && portOutNameSelected && nodeSelecteds.length) {
      let selectedNode = model.getNode(nodeSelecteds[0].id);
      if (selectedNode) {
        addNodes.forEach(nodeType => {
          let newGraphNode = createNewNode(createStepDataByType(nodeType, isGetUserReply, isSaveUserReply));

          const portOut = selectedNode.getPort(portOutNameSelected);
          const portOutCoord = engine.getPortCoords(portOut);
          const graphHeigh = document.querySelector('div.srd-diagram').clientHeight;
          const graphOffsetY = model.getOffsetY();

          // move graph upward if there is not enought space for adding step
          const portOutToBottom = graphHeigh - (portOutCoord.y + graphOffsetY);
          const distanceToBottomForNewNode = nodeType instanceof TextStepModel ? 375 : 330;

          const yOffsetToAddNewStep =
            portOutToBottom < distanceToBottomForNewNode ? distanceToBottomForNewNode - portOutToBottom : 0;
          model.setOffsetY(graphOffsetY - yOffsetToAddNewStep);

          const portIn = newGraphNode.getPort('portIn');
          const link = portOut.link(portIn);
          const coords = engine.getPortCoords(portOut);
          let selectedNodePosition = {
            x: coords.x - 60,
            y: coords.y + 75 - yOffsetToAddNewStep
          };
          newGraphNode.setPosition(selectedNodePosition.x, selectedNodePosition.y);
          model.addAll(newGraphNode, link);

          model.clearSelection();
          newGraphNode.setSelected(true);
          setNewNode(newGraphNode.serialize());
          updateSelected();
          startEndUpdate(newGraphNode.serialize());
        });
        client.writeData({ data: { addNodes: [], portOutNameSelected: null } });
      }
    } else if (addNodes.length > 0) {
      addNodes.forEach(nodeType => {
        let newGraphNode = createNewNode(createStepDataByType(nodeType));
        const lastNode = Object.entries(model.getNodes())
          .slice(-1)
          .pop();
        if (lastNode) {
          const y = isBranchStep(lastNode[1].type) ? 250 : 150;
          newGraphNode.setPosition(lastNode[1].x, lastNode[1].y + y);
        } else {
          newGraphNode.setPosition(150, 50);
        }
        model.addAll(newGraphNode);
        client.writeData({ data: { addNodes: [], portOutNameSelected: null } });
        startEndUpdate(newGraphNode.serialize());
      });
    }

    if (editNodes.length > 0) {
      editNodes.forEach(node => {
        node.updateFromPanel = true;
        updateNode(node);
      });
      client.writeData({ data: { editNodes: [] } });
      updateSelected();
    }

    if (deleteNodes.length > 0) {
      deleteNode(deleteNodes);
    }

    engine.repaintCanvas();
  }, [
    NodeEdit,
    addNodes,
    client,
    createNewNode,
    createStepDataByType,
    deleteNode,
    deleteNodes,
    editNodes,
    isBranchStep,
    nodeSelecteds,
    portOutNameSelected,
    startEndUpdate,
    updateNode,
    updateSelected,
    isGetUserReply,
    isSaveUserReply
  ]);

  engine.setDiagramModel(model);

  return (
    <>
      <CustomDiagramWidget
        className="srd-demo-canvas"
        diagramEngine={engine}
        deleteKeys={[]}
        maxNumberPointsPerLink="0"
        smartRouting={true}
        forceUpdate={forceUpdate}
      />
      <ArrowHead />
    </>
  );
};

export default Graph;
