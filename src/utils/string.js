import { EntityView } from "components/Common/EntityView";

export const ellipsisText = (text, maxLen) => {
  if(!text) return '';
  if(text.length > maxLen){
    return text.substr(0, maxLen/2) + '..' + text.substr(text.length - maxLen/2 + 1, text.length - 1);
  }
  return text;
}

export const formatEntityText = (text, entities, isGraph = false) => {
  if(!text) return '';
  if(typeof text !== 'string' || !entities || entities.length === 0) return text;

  var parts = text.split(/{([^}]+)}/g);
  for (var i = 1; i < parts.length; i += 2) {
    let entityName = parts[i];

    if (entityName.indexOf('.') > 0) {
      [entityName] = entityName.split('.');
    }

    const entity = entities.find(entity => entity.localeEntityNames.includes(entityName));

    // eslint-disable-next-line react/react-in-jsx-scope
    parts[i] = entity ? <EntityView key={i} entity={{viewName: parts[i], ...entity}} isGraph={isGraph}/> : '{' + parts[i] + '}';
  }

  return parts;
};