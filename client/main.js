import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Todos = new Mongo.Collection('todos');

Meteor.subscribe('todos');

// Template Helpers
Template.main.helpers({
  todos() {
    return Todos.find({}, {sort: {createdAt: -1}});
  }
});

Template.main.events({
  "submit .new-todo"(event) {
    let text = event.target.text.value;

    Meteor.call('addTodo', text);

    // Clear Form
    event.target.text.value = '';

    // Prevent Submit
    return false;
  },
  "click .toggle-checked"() {
    Meteor.call('setChecked', this._id, !this.checked);
  },
  "click .delete-todo"() {
    if(confirm('Are You Sure?')) {
      Meteor.call('deleteTodo', this._id);
    }
  }
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
})

// Meteor Methods
Meteor.methods({
  addTodo(text) {
    if(!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Todos.insert({
      text: text,
      createdAt: new Date(),
      userId: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTodo(todoId) {
    let todo = Todos.findOne(todoId);
    if(todo.userId !== Meteor.userId()) {
      Todos.remove(todoId);
    }
  },
  setChecked(todoId, setChecked) {
    let todo = Todos.findOne(todoId);
    if(todo.userId !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Todos.update(todoId, {$set:{checked: setChecked}});
  }
})
