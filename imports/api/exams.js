import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Exams = new Mongo.Collection('exams');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('exams', function tasksPublication() {
    return Exams.find();
  });
}
