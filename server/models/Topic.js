const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  topicId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nameHindi: { type: String, required: true },
  order: { type: Number, required: true },
  cachedTheory: {
    hindi: { type: String, default: '' },
    english: { type: String, default: '' },
    tamil: { type: String, default: '' },
    malayalam: { type: String, default: '' },
    generatedAt: { type: Date }
  },
  prerequisites: [{ type: String }],
  cachedDetailedTheory: {
    english: { type: String, default: '' },
    hindi:   { type: String, default: '' },
    tamil: { type: String, default: '' },
    malayalam: { type: String, default: '' },
    generatedAt: { type: Date },
  },
  stemContext: {
    subject:    { type: String, default: '' },
    connection: { type: String, default: '' },
  }
});

module.exports = mongoose.model('Topic', topicSchema);
