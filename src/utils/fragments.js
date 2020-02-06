import gql from 'graphql-tag';

export const EntityFragments = {
	generalDetail: gql`
		fragment ServerGeneralDetail on Entity {
			id
			type
			editorServiceId
			entityName
			memo
			defaultValue
			numberOfDecimalPlaces
			dateFormat
			isClearDataAfterConversationSuccess
			validateKeywords {
				type
				value
			}
			systemCreated
			variableName
			localeEntityNames
		}
	`,
	clientGeneralDetail: gql `
		fragment ClientGeneralDetail on CurrentEditEntity {
			id
			type
			editorServiceId
			entityName
			memo
			defaultValue
			numberOfDecimalPlaces
			dateFormat
			isClearDataAfterConversationSuccess
			validateKeywords {
				type
				value
			}
			systemCreated
			variableName
			localeEntityNames
		}
	`
}

export const GraphFragments = {
	stepGeneralDetail: gql`
		fragment StepGeneralDetail on Step {
			id
			type
			sequentialId
			conditionName
			message
			isSendMessage
			waitForUserInput
			isAllButtonSameFlow
			isCustomizeFlowElse
			saveMessageToEntities
			x
			y
			buttons {
				id
				label
        order
			}
			branches {
				id
        label
        order
				conditions {
					entityId
					equalEntityId
					operator
					value
				}
			}
		}
	`,
	edgeGeneralDetail: gql`
		fragment EdgeGeneralDetail on Edge {
			id
			sourceStepId
			targetStepId
			branchSourceStepId
			isAllBranchSameFlow
			isCustomizeFlowElse
		}
	`
}
