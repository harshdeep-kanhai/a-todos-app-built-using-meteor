import { Meteor } from 'meteor/meteor';

Todos = new Mongo.Collection('todos');

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
    Todos.remove(todoId);
  },
  setChecked(todoId, setChecked) {
    Todos.update(todoId, {$set:{checked: setChecked}});
  }
})
