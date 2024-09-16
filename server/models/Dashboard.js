const { model, Schema } = require('mongoose');

const dashboardSchema = new Schema({
    name: {
        required: true,
        type: String
    },
    ownerId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Dashboard = model('Dashboard', dashboardSchema);

module.exports = Dashboard;