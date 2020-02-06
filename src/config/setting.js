export const settings = {
  StepSettingTitle: {
    Button: 'button',
    ConditionEntity: 'conditionEntity',
    ConditionMessage: 'conditionMessage',
    Text: 'text',
    userReply: 'userReply',
    Setting: 'setting',
    entity: 'entity',
    createEntity: 'entity'
  },
  AddStepModalCategories: [
    {
      key: 'sendMessage',
      selected: false,
      items: [
        {
          key: 'text',
          icon: 'underline-text-button',
          type: 'Text',
          enabled: true
        },
        {
          key: 'button',
          icon: 'button-on',
          type: 'Button',
          enabled: true
        },
        {
          key: 'media',
          icon: 'photo-library',
          type: 'media'
        }
      ]
    },
    {
      key: 'customizeFlow',
      selected: false,
      items: [
        {
          key: 'conditionEntity',
          icon: 'version-control',
          type: 'ConditionEntity',
          enabled: true
        },
        {
          key: 'conditionMessage',
          icon: 'version-control',
          type: 'ConditionMessage'
        },
        {
          key: 'library',
          icon: 'folder-symbol',
          type: 'library'
        }
      ]
    },
    {
      key: 'searchManipulateData',
      selected: false,
      items: [
        {
          key: 'manipulateEntity',
          icon: 'toolbox'
        },
        {
          key: 'dataIntegration',
          icon: 'ai'
        }
      ]
    },
    {
      key: 'other',
      selected: false,
      items: [
        {
          key: 'sendNotification',
          icon: 'write-email-envelope-button'
        },
        {
          key: 'userSatisfaction',
          icon: 'good-mood-emoticon'
        }
      ]
    },
    {
      key: 'qa',
      selected: false,
      items: [
        {
          key: 'qa',
          icon: 'help-button-speech-bubble-with-question-mark'
        }
      ]
    }
  ],
  DataRegistrationList: ['entity', 'qa', 'intent', 'tags', 'dataIntegration'],
  DataRegistrationListEnabled: ['entity'],
  validates: {
    maxLength: {
      locationComment: 1000
    }
  },
  conditionEntityDate: [
    'specialDate',
    'userSent',
    'beforeChatDate',
    'afterChatDate'
  ],
  formatDate: 'YYYY/MM/DD',
  EntityType: {
    StringEntity: 'StringEntity',
    NumberEntity: 'NumberEntity',
    UrlEntity: 'UrlEntity',
    DateEntity: 'DateEntity',
    TimeEntity: 'TimeEntity',
    EmailAddressEntity: 'EmailAddressEntity',
    JsonEntity: 'JsonEntity'
  },
  locales: ['en', 'ja'],
  step: {
    propertiesUnnecessary: [
      'allowsDelete',
      'extras',
      'isEdited',
      'ports',
      'selected',
      'childs',
      'name',
      'stepId',
      'isOpenUserReply',
      'isDisabledWaitMessage',
      'updateFromPanel',
      'position',
      'isSaveUserReply',
      'isDragging'
    ]
  },
  delayTimeUpdatePosition: 500,
  defaultFormatOtions: [
    {
      label: 'yyyy-mm-dd',
      value: 'yyyy-mm-dd'
    },
    {
      label: 'dd-mm-yyyy',
      value: 'dd-mm-yyyy'
    },
    {
      label: 'mm-dd-yyyy',
      value: 'mm-dd-yyyy'
    }
  ],
  urlRegex: /http|https(?:$|[^\s　]+)/,
  // eslint-disable-next-line no-useless-escape
  emailRegex: /^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/
};
