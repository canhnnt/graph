import {
  GET_DATA_RIGHT_PANEL,
  GET_STEP_EDITING,
  GET_NODE_SELECTEDS,
  GET_SERVICES,
  GET_USER_REPLY_DATA,
  GET_STEP_NODE_ID_MAPPING,
  GET_APP_DATA
} from 'utils/queries';
import { useQuery, useApolloClient, useMutation } from 'react-apollo';
import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CommonPortModel } from './components/Common/CommonPortModel';
import { GET_GRAPH_DATA } from 'utils/queries';
import { POST_STEP, DELETE_STEP, SAVE_EDGE, DELETE_EDGE } from './mutations';
import { settings } from 'config/setting';
import { getEgdes } from './helpers';
import { engine } from './config';
import { convertStepJsonDataToGraphData } from 'utils/helpers'
import showNotification from '../../components/Notification';

export const useGiveEditedState = model => {
  const {
    data: {
      nodeSelecteds,
      stepEditing,
      userReply: { NodeEdit }
    }
  } = useQuery(GET_DATA_RIGHT_PANEL);
  const [lastStepSelected, setLastStepSelected] = useState();
  const [editingStep, setEditingStep] = useState(null);

  useEffect(() => {
    if(stepEditing.length && (!editingStep || stepEditing[0].id !== editingStep.id)) {
      setEditingStep(stepEditing[0]);
    }
  }, [editingStep,stepEditing])

  useEffect(() => {
    if(editingStep && nodeSelecteds.length) {
      if(nodeSelecteds[0].id !== editingStep.id && !stepEditing.length) {
        let editingStepOnGraph = model.getNode(editingStep.id);
        if (editingStepOnGraph) {
          editingStepOnGraph.state.isEdited = false;
          setEditingStep(null);
        }
      }
    }

  },[nodeSelecteds, stepEditing, editingStep, model])

  useEffect(() => {
    const NodeIdEdit = NodeEdit ? NodeEdit.id : null;
    if (nodeSelecteds.length > 0) {
      const step = model.getNode(nodeSelecteds[0].id);
      if (step && step.state) {
        step.state.isEdited = stepEditing.length > 0 && stepEditing[0].id === step.id && !NodeIdEdit;
        step.state.isOpenUserReply = step.id === NodeIdEdit;
        step.setSelected(true);
        if (!lastStepSelected) {
          setLastStepSelected(step);
          return;
        }
        if (lastStepSelected.id !== step.id) {
          lastStepSelected.state.isOpenUserReply =
            lastStepSelected.id === NodeIdEdit;
          setLastStepSelected(step);
        }
      }
    }
    // in new behaviour, only click on icon user can remove state select of step
    if (lastStepSelected && lastStepSelected.state) {
      lastStepSelected.state.isOpenUserReply = lastStepSelected.id === NodeIdEdit;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [NodeEdit, model, nodeSelecteds, stepEditing]);
};

export const useStepEditing = node => {
  const client = useApolloClient();
  useEffect(() => {
    if (node) {
      client.writeQuery({
        query: GET_STEP_EDITING,
        data: {
          stepEditing: [node]
        }
      });
    }
  }, [client, node]);
};

export const useGraphStructure = () => {
  const [steps, setSteps] = useState([]);
  const [edges, setEdges] = useState([]);
  const [entities, setEntities] = useState([]);
  const {
    data: {
      editorService: { id }
    }
  } = useQuery(GET_SERVICES);
  const { data } = useQuery(GET_GRAPH_DATA, {
    variables: { editorServiceId: id },
    skip: !id
  });

  useEffect(() => {
    if (data) {
      const { steps, edges } = data.findGraphByEditorServiceId;
      // if(edges && edges.length > 0){
      //   edges.forEach(edge => {
      //     delete edge.__typename;
      //   });
      // }
      setSteps(steps || []);
      setEdges(edges || []);
      setEntities(data.entities || []);
    }
  }, [data]);

  return [steps, edges, entities];
};

const useUpdatePorts = () => {
  const [, deleteEdge] = useEdge();
  return useCallback(node => {
    const childIds = node.state.childs.map(child => child.id);
    const ports = node.getPorts();
    Object.entries(ports).forEach(([portKey, port]) => {
      if (
        portKey.indexOf('childPortOut') > -1 &&
        !childIds.includes(portKey.substr(12))
      ) {
        const links = port.getLinks();
        Object.entries(links).forEach(([linkName, link]) => {
          link.remove();
          if(link.edgeId){
            deleteEdge(link.edgeId);
          }
        });
        node.removePort(port);
      }
    });

    childIds.forEach( id => {
      if (node.getPort(`childPortOut${id}`) === undefined) {
        node.addPort(new CommonPortModel(false, `childPortOut${id}`));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useUpdateButtonStepToGraph = () => {
  const updatePorts = useUpdatePorts();
  const [t] = useTranslation();

  return useCallback(
    (currentNode, newNode, newStep) => {
      let buttons = newStep.buttons || [];
      buttons = buttons.map( ({__typename, ...button}) => button );
      let childs = [...buttons];

      if (newNode.isAllButtonSameFlow) {
        childs = [{id: 'All', label: t('step.button.allButtons') }];
      }

      if (newNode.isCustomizeFlowElse) {
        childs.push({id: 'Else',label: t('step.button.else') });
      }

      currentNode.state = {
        ...currentNode.state,
        stepId: newStep.id,
        childs: childs,
        buttons: buttons,
        sequentialId: newStep.sequentialId,
        isCustomizeFlowElse: newNode.isCustomizeFlowElse,
        isAllButtonSameFlow: newNode.isAllButtonSameFlow,
        isSendMessage: newNode.isSendMessage,
        message: newNode.isSendMessage ? newNode.message : '',
        isSaveUserReply: false,
        isEdited: false,
        waitForUserInput: newNode.waitForUserInput,
        saveMessageToEntities: newNode.saveMessageToEntities
      };
      updatePorts(currentNode);
      return currentNode;
    },
    [t, updatePorts]
  );
};

export const useUpdateConditionEntityToGraph = () => {
  const updatePorts = useUpdatePorts();
  const [t] = useTranslation();
  return useCallback(
    (currentNode, newNode, newStep) => {
      let branches = newNode.childs || [];
      branches = branches.filter(branch => branch.conditions.length && branch.conditions[0].condition_type !== 'Else');
      if (branches.length && newStep.branches.length) {
        branches = branches.map((branch, index) => {
          branch.id = newStep.branches[index].id;
          return branch;
        });
      }

      if (branches.length > 0) {
        branches = [...branches, {
          id: 'Else',
          label: t('step.button.else'),
          conditions: [
            {
              condition_type: 'Else',
              condition_value: 'Else'
            }
          ]
        }];
      }

      currentNode.state = {
        ...currentNode.state,
        stepId: newStep.id,
        childs: branches,
        isEdited: newNode.isEdited,
        conditionName: newNode.conditionName,
        sequentialId: newStep.sequentialId
      };
      updatePorts(currentNode);
      return currentNode;
    },
    [t, updatePorts]
  );
};

export const useUpdateTextStepToGraph = () => {
  return useCallback(
    (currentNode, newNode, newStep) => {
      // TO DO: remove newStep in the future in every Step

      currentNode.state = {
        ...currentNode.state,
        stepId: newStep.id,
        message: newNode.message,
        isEdited: false,
        sequentialId: newStep.sequentialId,
        isSaveUserReply: false,
        waitForUserInput: newNode.waitForUserInput,
        saveMessageToEntities: newNode.saveMessageToEntities
      };
      return currentNode;
    },
    []
  );
};

export const useUpdateStartEndStepToGraph = () => {
  return useCallback(
    (currentNode, newStep) => {
      currentNode.state = {
        ...currentNode.state,
        stepId: newStep.id,
        sequentialId: newStep.sequentialId
      }
      return currentNode;
    }, []
  )
}

export const useUpdateUserReplySetting = model => {
  const updateStep = useUpdateStep(model);
  const [syncStep] = useSyncStep(model);
  const [stepUserReply, setStepUserReply] = useState(null);
  const {
    data: { userReply: { stepData } }
  } = useQuery(GET_USER_REPLY_DATA);

  useEffect(() => {
    setStepUserReply(stepData);
  }, [stepData]);

  return useCallback(
    stepSetting => {
      const currentStep = model.getNode(stepSetting.id);
      if (!currentStep) return;

      const userReplySetting = {
        waitForUserInput: stepSetting.waitForUserInput,
        saveMessageToEntities: stepSetting.saveMessageToEntities,
        isDisabledWaitMessage: stepSetting.isDisabledWaitMessage,
        updateFromPanel: true
      };

      if(['Button', 'Text'].includes(currentStep.type) && stepUserReply){
        updateStep({...stepUserReply, ...userReplySetting});
      }else{
        const step = {
          stepId: currentStep.state.stepId,
          type: currentStep.type,
          x: currentStep.x,
          y: currentStep.y,
          ...userReplySetting
        };
        syncStep({ step });
      }
    },
    [model, stepUserReply, syncStep, updateStep]
  );
};

const useUpdateButtonStep = model => {
  const [syncStep] = useSyncStep(model);

  return useCallback(
    (newNode) => {
      const step = JSON.parse(JSON.stringify(newNode));
      step.edges = getEgdes(model, portInLinked(newNode));

      syncStep({ step, originStep: newNode });
    },
    [model, syncStep]
  );
};

const useUpdateConditionEntity = model => {
  const [syncStep] = useSyncStep(model);

  return useCallback(
    (newNode) => {
      const step = JSON.parse(JSON.stringify(newNode));
      step.edges = getEgdes(model, portInLinked(newNode));
      step.branches = step.childs
        .filter(child => {
          return (
            (child.conditions.length &&
              child.conditions[0].condition_type !== 'Else') ||
            !child.conditions.length
          );
        })
        .map(branch => {
          return {
            id: branch.id,
            label: branch.label,
            order: branch.order,
            conditions: branch.conditions.map(condition => {
              let condition_value = condition.condition_value;
              if (condition_value.id) {
                condition_value = '';
              } else if (condition_value.type) {
                condition_value = JSON.stringify(condition_value);
              }
              return {
                entityId: condition.entity.id,
                equalEntityId: condition.condition_value.id,
                operator: condition.condition_type,
                value: condition_value.toString()
              };
            })
          };
        });


      syncStep({ step, originStep: newNode });
    },
    [model, syncStep]
  );
};

const useUpdateTextStep = model => {
  const [syncStep] = useSyncStep(model);

  return useCallback(
    (newNode) => {
      const step = JSON.parse(JSON.stringify(newNode));
      step.edges = getEgdes(model, portInLinked(newNode));

      syncStep({ step, originStep: newNode });
    },
    [model, syncStep]
  );
};

export const useStartEndUpdate = model => {
  const [syncStep] = useSyncStep(model);

  return useCallback(
    newNode => {
      if (['Start', 'End'].includes(newNode.type)) {
        const step = JSON.parse(JSON.stringify(newNode));
        step.edges = getEgdes(model, portInLinked(newNode));
        syncStep({ step, originStep: newNode });
      }
    },
    [model, syncStep]
  );
};

export const useUpdateSelected = model => {
  const client = useApolloClient();
  return useCallback(() => {
    let nodeSelecteds = model
      .getSelectedItems()
      .filter(item => item.type !== undefined);
    const data = { nodeSelecteds: nodeSelecteds.map(node => node.serialize()) };
    client.writeQuery({ query: GET_NODE_SELECTEDS, data: data });
  }, [client, model]);
};

export const useDeleteNode = (model) => {
  const client = useApolloClient();
  const updateSelected = useUpdateSelected(model);
  const {
    data: {
      editorService: { id }
    }
  } = useQuery(GET_SERVICES);
  const { data: { stepAndNodeIdMapping } } = useQuery(GET_STEP_NODE_ID_MAPPING);
  const [deleteStep] = useMutation(DELETE_STEP);

  const removeNodeAndPort = useCallback(
    node => {
      const ports = node.getPorts();
      Object.entries(ports).forEach(([portName, port]) => {
        Object.entries(port.links).forEach(([linkName, link]) => link.remove());
      });
      model.removeNode(node);
    },
    [model]
  );

  return useCallback((deleteNodes) => {
    deleteNodes.forEach(nodeId => {
      const node = model.getNode(nodeId);
      if (!node) return;

      const stepId =
        (node.state && node.state.stepId) ||
        (node.options && node.options.stepId);

      let stepNodeIdMapping = JSON.parse(stepAndNodeIdMapping);
      if (stepId) {
        deleteStep({
          variables: { editorServiceId: id, stepId }
        }).then(result => {
          const { status, step: deletedStep, edges: deletedEdges } = result.data.deleteStep;
          if (status === 200) {
            const { findGraphByEditorServiceId: { status, steps, edges }, entities } = client.readQuery({
              query: GET_GRAPH_DATA,
              variables: { editorServiceId: id }
            });
            const deleteEdgeIds = deletedEdges.map(e => e.id);
            let graphSteps = [...steps];
            let graphEdges = [...edges];
            let stepIndex = graphSteps.findIndex(s => s.id === deletedStep.id);

            if (stepIndex >= 0) {
              graphSteps.splice(stepIndex, 1);
            }

            if (deleteEdgeIds.length) {
              graphEdges = graphEdges.filter(e => !deleteEdgeIds.includes(e.id));
            }

            removeNodeAndPort(node);

            client.writeQuery({
              query: GET_GRAPH_DATA,
              variables: { editorServiceId: id },
              data: {
                findGraphByEditorServiceId: {
                  __typename: 'findGraphByEditorServiceId',
                  status,
                  steps: graphSteps,
                  edges: graphEdges
                },
                entities
              }
            });

            delete stepNodeIdMapping[deletedStep.id];
            client.writeQuery({
              query: GET_APP_DATA,
              data: {
                deleteNodes: [],
                nodeSelecteds: [],
                stepAndNodeIdMapping: JSON.stringify(stepNodeIdMapping)
              }
            });

            engine.repaintCanvas();
            showNotification("deleteStepSuccess");
          }
        }).catch(() => {
          showNotification("deleteStepFail", true);
        });
      } else {
        removeNodeAndPort(node);
      }

    });
    updateSelected();
  }, [
    client,
    deleteStep,
    id,
    model,
    removeNodeAndPort,
    updateSelected,
    stepAndNodeIdMapping
  ]);
};

export const useUpdateStep = model => {
  const updateConditionEntity = useUpdateConditionEntity(model);
  const updateButtonStep = useUpdateButtonStep(model);
  const updateTextStep = useUpdateTextStep(model);
  const startEndUpdate = useStartEndUpdate(model);

  return useCallback(
    node => {
      switch (node.type) {
        case 'Button':
          updateButtonStep(node);
          return;
        case 'ConditionEntity':
          updateConditionEntity(node);
          return;
        case 'Text':
          updateTextStep(node);
          return;
        default:
          startEndUpdate(node);
          return;
      }
    },
    [
      startEndUpdate,
      updateButtonStep,
      updateConditionEntity,
      updateTextStep
    ]
  );
};

export const useSyncStep = model => {
  const client = new useApolloClient();
  const {
    data: {
      editorService: { id }
    }
  } = useQuery(GET_SERVICES);
  const { data: { stepAndNodeIdMapping } } = useQuery(GET_STEP_NODE_ID_MAPPING);
  const [postBackend, { data, loading: mutationLoading }] = useMutation(POST_STEP);

  return [
    useCallback(
      (vars) => {
        const { step, originStep } = vars;
        const updateFromPanel = step.updateFromPanel;
        const isDraggingStep = step.isDragging;
        let stepNodeIdMapping = JSON.parse(stepAndNodeIdMapping);
        let isNewStep = step.stepId ? false : true;
        step.id = step.stepId;
        step.waitForUserInput = step.waitForUserInput || false;
        step.saveMessageToEntities = step.saveMessageToEntities
          ? step.saveMessageToEntities.map(e => e.id)
          : [];
        if (step) {
          deleteProperties(step);
        }
        postBackend({
          variables: {
            step,
            editorServiceId: id
          }
        }).then(data => {
          const { status, step: newStep, edges: newEdges } = data.data.saveStep;
          let appData = {
            Show: {
              id: 'ShowPanel',
              __typename: 'ShowPanel',
              StepSettingType: null,
              StepSettingPanel: false,
              SettingPanel: false,
              SimulatorPanel: false,
            },
            stepEditing: [],
          };

          if (status === 200) {
            if (isNewStep) {
              showNotification("createStepSuccess")
            } else if (!isNewStep && updateFromPanel) {
              showNotification("updateStepSuccess")
            }

            if (newStep && newEdges) {
              const { findGraphByEditorServiceId: { status, steps, edges }, entities } = client.readQuery({
                query: GET_GRAPH_DATA,
                variables: { editorServiceId: id }
              });
              let graphSteps = [...steps];
              let graphEdges = [...edges];
              let stepIndex = graphSteps.findIndex(s => s.id === newStep.id);
              if (stepIndex < 0) {
                graphSteps.push(newStep);
              } else {
                graphSteps[stepIndex] = {...graphSteps[stepIndex], ...newStep};
              }

              if(!['Start'].includes(newStep.type) && newEdges.length) {
                let edgeIndex = graphEdges.findIndex(e => e.id === newEdges[0].id);

                if (edgeIndex < 0) {
                  graphEdges.push(newEdges[0]);
                } else {
                  graphEdges[edgeIndex] = {...graphEdges[edgeIndex], ...newEdges[0]};
                }
              }

              if (isNewStep) {
                stepNodeIdMapping[newStep.id] = originStep.id;
                appData.stepAndNodeIdMapping = JSON.stringify(stepNodeIdMapping);
              }

              if (['Text', 'Button'].includes(newStep.type)) {
                appData.userReply = {
                  id: 'UserReply',
                  __typename: 'UserReply',
                  stepData: null,
                  NodeEdit: null,
                  isGetUserReply: false,
                  isSaveUserReply: false,
                  StepSettingTypeBack: null
                };
              }

              if (!isDraggingStep) {
                client.writeQuery({
                  query: GET_APP_DATA,
                  data: appData
                });
              }

              client.writeQuery({
                query: GET_GRAPH_DATA,
                variables: { editorServiceId: id },
                data: {
                  findGraphByEditorServiceId: {
                    __typename: 'findGraphByEditorServiceId',
                    status,
                    steps: graphSteps,
                    edges: graphEdges
                  },
                  entities
                }
              });
            }
            // if (edges.length) {
            //   const link = model.getLink(portInLinked(originStep)[0].links[0]);
            //   link.edgeId = edges[0].id;
            // }
          }
          engine.repaintCanvas();
        }).catch( () => {
          if(isNewStep) {
            showNotification("createStepFail", true)
          } else if (!isNewStep && updateFromPanel) {
            showNotification("updateStepFail", true)
          }
        });
      },
      [postBackend, id, client, stepAndNodeIdMapping]
    ),
    data,
    mutationLoading
  ];
};

export const useCreateStepDataByType = () => {
  const [t] = useTranslation();
  return useCallback(
    (type, isGetUserReply = false, isSaveUserReply = false) => {
      const { position, ...step } = convertStepJsonDataToGraphData(
        { type, isGetUserReply, isSaveUserReply },
        t
      );
      return step;
    },
    [t]
  );
};

export const portInLinked = step =>
  step.ports.filter(port => port.links.length > 0 && port.name === 'portIn');

const deleteProperties = step => {
  settings.step.propertiesUnnecessary.forEach(property => {
    delete step[property];
  });
};

export const useEdge = () => {
  const {
    data: {
      editorService: { id }
    }
  } = useQuery(GET_SERVICES);
  const [saveEdge] = useMutation(
    SAVE_EDGE
  );
  const [deleteEdge] = useMutation(DELETE_EDGE);
  const client= useApolloClient();

  return [
    useCallback(
      ({edge, link}, callback) => {
        if(!edge){
          return;
        }
        saveEdge({
          variables: {
            edge,
            editorServiceId: id
          }
        }).then(data => {
          const { status, edge } = data.data.saveEdge;
          if (status === 200) {
            callback && callback();
            if (edge.id) {
              link.edgeId = edge.id;
            }
          }
          engine.repaintCanvas();
        });
      },
      [saveEdge, id]
    ),
    useCallback((edgeId, callback) => {
      if(!edgeId){
        return;
      }
      deleteEdge({
        variables: {
          edgeId,
          editorServiceId: id
        }
      }).then(data => {
        const { status } = data.data.deleteEdge;
        if (status === 200) {
          callback && callback();

          const { findGraphByEditorServiceId: { edges }, findGraphByEditorServiceId } = client.readQuery({
            query: GET_GRAPH_DATA,
            variables: { editorServiceId: id }
          });
          const edgesUpdated = edges.filter(edge => edge.id !== edgeId);
          client.writeQuery({
            query: GET_GRAPH_DATA,
            variables: { editorServiceId: id },
            data: {
              findGraphByEditorServiceId: {
                ...findGraphByEditorServiceId,
                edges: edgesUpdated
              }
            }
          });
        }
        engine.repaintCanvas();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteEdge, id]),
  ];
}
