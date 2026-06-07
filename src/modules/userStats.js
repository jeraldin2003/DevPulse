
  function getTotalUsers(users) {
    let count = 0;
  
    for (let i = 0; i < users.length; i++) {
      count = count + 1;
    }
  
    return count;
  }
  
  function getTotalCompanies(users) {
    const companyNames = [];
  
    for (let i = 0; i < users.length; i++) {
      const name = users[i].company.name;
      let isDuplicate = false;
  
      for (let j = 0; j < companyNames.length; j++) {
        if (companyNames[j] === name) {
          isDuplicate = true;
          break;
        }
      }
  
      if (!isDuplicate) {
        companyNames.push(name);
      }
    }
  
    return companyNames.length;
  }
  
  export function userStats(users) {
    const totalUsers = getTotalUsers(users);
    const totalCompanies = getTotalCompanies(users);
  
    return {
      totalUsers,
      totalCompanies,
    };
  }