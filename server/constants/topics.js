const topics = [
  {
    topicId: 'variables',
    name: 'Variables',
    nameHindi: 'वेरिएबल्स',
    order: 1,
    prerequisites: [],
    stemContext: {
      subject: 'Science',
      connection: 'Storing data like temperature, speed, score',
      connectionHindi: 'तापमान, स्पीड, स्कोर जैसा डेटा स्टोर करना',
    },
  },
  {
    topicId: 'data-types',
    name: 'Data Types',
    nameHindi: 'डेटा टाइप्स',
    order: 2,
    prerequisites: ['variables'],
    stemContext: {
      subject: 'Science',
      connection: 'Different types of measurements — numbers, text, true/false',
      connectionHindi: 'अलग प्रकार के माप — नंबर, टेक्स्ट, सही/गलत',
    },
  },
  {
    topicId: 'conditions',
    name: 'Conditions',
    nameHindi: 'कंडीशंस',
    order: 3,
    prerequisites: ['variables', 'data-types'],
    stemContext: {
      subject: 'Physics',
      connection: 'If speed > limit then brake',
      connectionHindi: 'अगर स्पीड > लिमिट तो ब्रेक लगाओ',
    },
  },
  {
    topicId: 'loops',
    name: 'Loops',
    nameHindi: 'लूप्स',
    order: 4,
    prerequisites: ['conditions'],
    stemContext: {
      subject: 'Math',
      connection: 'Repeat calculations like multiplication tables',
      connectionHindi: 'गणना दोहराना जैसे पहाड़े',
    },
  },
  {
    topicId: 'functions',
    name: 'Functions',
    nameHindi: 'फंक्शंस',
    order: 5,
    prerequisites: ['loops'],
    stemContext: {
      subject: 'Engineering',
      connection: 'Reusable formulas like area, speed, force',
      connectionHindi: 'दोबारा उपयोग होने वाले फार्मूले जैसे क्षेत्रफल, गति, बल',
    },
  },
  {
    topicId: 'lists',
    name: 'Lists',
    nameHindi: 'लिस्ट्स',
    order: 6,
    prerequisites: ['functions'],
    stemContext: {
      subject: 'Math',
      connection: 'Store multiple values like player scores, temperatures',
      connectionHindi: 'कई मान स्टोर करना जैसे खिलाड़ी के स्कोर, तापमान',
    },
  },
  {
    topicId: 'strings',
    name: 'String Methods',
    nameHindi: 'स्ट्रिंग मेथड्स',
    order: 7,
    prerequisites: ['lists'],
    stemContext: {
      subject: 'Technology',
      connection: 'Process text — names, messages, DNA sequences',
      connectionHindi: 'टेक्स्ट प्रोसेस करना — नाम, संदेश, DNA अनुक्रम',
    },
  },
  {
    topicId: 'oop',
    name: 'Basic OOP',
    nameHindi: 'बेसिक OOP',
    order: 8,
    prerequisites: ['functions', 'lists'],
    stemContext: {
      subject: 'Engineering',
      connection: 'Model real objects — cars, animals, planets',
      connectionHindi: 'वास्तविक वस्तुओं को मॉडल करना — कार, जानवर, ग्रह',
    },
  },
  {
    topicId: 'error-handling',
    name: 'Error Handling',
    nameHindi: 'एरर हैंडलिंग',
    order: 9,
    prerequisites: ['oop'],
    stemContext: {
      subject: 'Science',
      connection: 'Handle invalid inputs — invalid temperature, wrong score',
      connectionHindi: 'गलत इनपुट संभालना — गलत तापमान, गलत स्कोर',
    },
  },
  {
    topicId: 'algorithms',
    name: 'Algorithms',
    nameHindi: 'एल्गोरिद्म',
    order: 10,
    prerequisites: ['error-handling'],
    stemContext: {
      subject: 'Math',
      connection: 'Find highest scorer, sort results, search data',
      connectionHindi: 'सबसे ज़्यादा स्कोर ढूंढना, रिज़ल्ट सॉर्ट करना, डेटा खोजना',
    },
  },
]

module.exports = topics
