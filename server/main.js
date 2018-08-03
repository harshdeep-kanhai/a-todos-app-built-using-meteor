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

Meteor.publish('todos', () => {
  if(!this.userId) {
    return Todos.find()
  } else {
    return Todos.find({userId: this.userId});
  }

});
