
import { StartStepFactory } from './components/CustomSteps/NavigationSteps/StartStep/StartStepFactory';
import { TextStepFactory } from './components/CustomSteps/BotSteps/TextStep/TextStepFactory';
import { ButtonStepFactory } from './components/CustomSteps//BranchSteps/ButtonStep/ButtonStepFactory';
import { ConditionEntityStepFactory } from "./components/CustomSteps//BranchSteps/ConditionEntityStep/ConditionEntityStepFactory";

import { EndStepFactory } from './components/CustomSteps//NavigationSteps/EndStep/EndStepFactory';
import { ConditionMessageStepFactory } from './components/CustomSteps//BranchSteps/ConditionMessageStep/ConditionMessageStepFactory';
import { CustomLinkFactory } from "./components/CustomGraph/CustomLinkFactory";

import { CustomDiagramModel } from "./components/CustomGraph/CustomDiagramModel";
import { CustomDiagramEngine } from "./components/CustomGraph/CustomDiagramEngine";

const engine = new CustomDiagramEngine();
engine.installDefaultFactories();
engine.registerLinkFactory(new CustomLinkFactory());

engine.registerNodeFactory(new StartStepFactory());
engine.registerNodeFactory(new TextStepFactory());
engine.registerNodeFactory(new EndStepFactory());
engine.registerNodeFactory(new ButtonStepFactory());
engine.registerNodeFactory(new ConditionEntityStepFactory());
engine.registerNodeFactory(new ConditionMessageStepFactory());


const model = new CustomDiagramModel();
export {
  engine,
  model
};
