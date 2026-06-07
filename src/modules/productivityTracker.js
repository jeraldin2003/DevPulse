
  function getTodosForUser(userId, todos) {
    const userTodos = [];
  
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].userId === userId) {
        userTodos.push(todos[i]);
      }
    }
  
    return userTodos;
  }
  
  function getCompletedCount(todos) {
    let completed = 0;
  
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].completed === true) {
        completed = completed + 1;
      }
    }
  
    return completed;
  }
  
  function getCompletionPercentage(total, completed) {
    if (total === 0) {
      return 0;
    }
  
    const percentage = (completed / total) * 100;
    return Math.round(percentage);
  }
  
  function getCompletionForAllUsers(users, todos) {
    const results = [];
  
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const userTodos = getTodosForUser(user.id, todos);
      const total = userTodos.length;
      const completed = getCompletedCount(userTodos);
      const completionPercentage = getCompletionPercentage(total, completed);
  
      results.push({
        userId: user.id,
        userName: user.name,
        totalTodos: total,
        completedTodos: completed,
        completionPercentage,
      });
    }
  
    return results;
  }
  
  export function productivityTracker(users, todos) {
    const userCompletionStats = getCompletionForAllUsers(users, todos);
  
    return {
      userCompletionStats,
    };
  }