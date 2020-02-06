import { isEqual } from 'apollo-utilities';

export const getEgdes = (model, ports) => {
  const edges = [];
  ports.forEach(port => {
    if(port.links.length > 0 && port.name === 'portIn'){
      const link = model.getLink(port.links[0]);
      edges.push(linkToEdge(link));
    }
  });
  return edges;
}

export const linkToEdge = link => {
  if (!link) return;

  const {sourcePort, targetPort} = link;

  if (!sourcePort || !targetPort) return;

  const sourceStep = sourcePort.parent.state;
  const targetStepId = targetPort.parent.state.stepId;

  if (!sourceStep || !sourceStep.stepId) return;

  let branchSourceStepId = null;
  let isCustomizeFlowElse = false;
  let isAllBranchSameFlow = false;
  const childId = sourcePort.name.replace('childPortOut', '');

  if (sourceStep.type === 'ConditionEntity') {
    const child = sourceStep.childs.find(child => child.id === childId);

    if (child && child.conditions[0].condition_type === 'Else') {
      isCustomizeFlowElse = true;
    } else {
      branchSourceStepId = childId;
    }
  } else if (sourceStep.type === 'Button') {
    if (sourceStep.isAllButtonSameFlow && childId === 'All') {
      isAllBranchSameFlow = true;
    } else if (sourceStep.isCustomizeFlowElse && childId === 'Else' ) {
      isCustomizeFlowElse = true;
    } else {
      branchSourceStepId = childId;
    }
  }

  return {
    id: link.edgeId,
    sourceStepId: sourceStep.stepId,
    targetStepId,
    branchSourceStepId,
    isCustomizeFlowElse,
    isAllBranchSameFlow
  }
}

export const isntChangeEdge = (edges, edge) => {
  const result = edges.filter(e => isEqual(e, edge));
  if(result.length > 0){
    return true;
  }
  return false;
}
