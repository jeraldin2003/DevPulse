
  function getTotalPosts(posts) {
    let count = 0;
  
    for (let i = 0; i < posts.length; i++) {
      count = count + 1;
    }
  
    return count;
  }
  
  function getPostCountPerUser(posts) {
    const userCounts = [];
  
    for (let i = 0; i < posts.length; i++) {
      const userId = posts[i].userId;
      let foundIndex = -1;
  
      for (let j = 0; j < userCounts.length; j++) {
        if (userCounts[j].userId === userId) {
          foundIndex = j;
          break;
        }
      }
  
      if (foundIndex === -1) {
        userCounts.push({ userId, postCount: 1 });
      } else {
        userCounts[foundIndex].postCount = userCounts[foundIndex].postCount + 1;
      }
    }
  
    return userCounts;
  }
  
  function sortByPostCountDescending(userCounts) {
    const sorted = [];
  
    for (let i = 0; i < userCounts.length; i++) {
      sorted.push(userCounts[i]);
    }
  
    for (let i = 0; i < sorted.length - 1; i++) {
      for (let j = 0; j < sorted.length - i - 1; j++) {
        if (sorted[j].postCount < sorted[j + 1].postCount) {
          const temp = sorted[j];
          sorted[j] = sorted[j + 1];
          sorted[j + 1] = temp;
        }
      }
    }
  
    return sorted;
  }
  
  function getTop5UsersByPostCount(posts) {
    const userCounts = getPostCountPerUser(posts);
    const sorted = sortByPostCountDescending(userCounts);
    const top5 = [];
  
    const limit = sorted.length < 5 ? sorted.length : 5;
  
    for (let i = 0; i < limit; i++) {
      top5.push(sorted[i]);
    }
  
    return top5;
  }
  
  export function postAnalysis(posts) {
    const totalPosts = getTotalPosts(posts);
    const top5UsersByPostCount = getTop5UsersByPostCount(posts);
  
    return {
      totalPosts,
      top5UsersByPostCount,
    };
  }