import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Todos = new Mongo.Collection('todos');

// Template Helpers
Template.main.helpers({
  todos() {
    return Todos.find({}, {sort: {createdAt: -1}});
  }
});

Template.main.events({
  "submit .new-todo"(event) {
    let text = event.target.text.value;

    Todos.insert({
      text: text,
      createdAt: new Date()
    });

    // Clear Form
    event.target.text.value = '';

    // Prevent Submit
    return false;
  },
  "click .toggle-checked"() {
    Todos.update(this._id, {$set:{checked: ! this.checked}});
  },
  "click .delete-todo"() {
    if(confirm('Are You Sure?')) {
      Todos.remove(this._id);
    }
  }
});
