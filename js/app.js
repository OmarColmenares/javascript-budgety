//BUDGET CONTROLLER
const budgetContoller = (() => {
  class Expense {
    constructor (id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
    }

    calculatePercentage(totalInc) {
      this.percentage =
        totalInc > 0 ? Math.round((this.value / totalInc) * 100) : -1;
    }

    getPercentages() {
      return this.percentage;
    }
  };

  class Income {
    constructor(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    }
  };

  const calculateTotal = (type) => {
    let sum = 0;
    data.allItems[type].forEach(cur => sum += cur.value);
    data.totals[type] = sum;
  };
  //data structure
  let data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  return {
    addItem: (type, desc, val) => {
      let newItem, ID;
      //Create new ID
      if (data.allItems[type].length > 0) {
        //Find the last element of the array and add 1
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      };
      //Create new Item
      type === 'inc' ? (newItem = new Income(ID, desc, val)) : (newItem = new Expense(ID, desc, val));
      //Push it into our data structure
      data.allItems[type].push(newItem);
      // Return the new element
      return newItem;
    },
    deleteItem: (type, id) => {
      let ids, index;
      ids = data.allItems[type].map((cur) => cur.id);
      index = ids.indexOf(id);

      if (index !== -1) data.allItems[type].splice(index, 1);
    },
    setItemInput: (type, id) => {
      let ids, index, item;
      ids = data.allItems[type].map((cur) => cur.id);
      index = ids.indexOf(id);
      item = data.allItems[type][index];
      return item;
    },
    testing: () => {
      console.log(data);
    },
    calculateBudget: () => {
      // Calculate total income and expenses
      calculateTotal('inc');
      calculateTotal('exp');
      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      //Calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percetage = -1;
      }
    },
    calculatePercentages: () => {
      data.allItems.exp.forEach(cur => cur.calculatePercentage(data.totals.inc));
    },
    getPercentages: () => {
      return data.allItems.exp.map(cur => cur.percentage);
    },
    getBudget: () => {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },
    persistData: () => {
      localStorage.setItem('data', JSON.stringify(data.allItems));
    },
    readStorage: () => {
      let items = JSON.parse(localStorage.getItem('data', data.allItems));
      if (items) {
        items.allItems = items;
        return items;
      }
    },
  };
})();
//UI CONTROLLER
const UIController = (() => {
  const DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    editBtn: '.edit__btn',
    cancelBtn: '.cancel__edit',
    printBtn: '.print__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    addContainer: '.add__container',
    container: '.container',
    editContainer: '.id__container',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    expensesListLabel: '.item__percentage',
    monthLabel: '.budget__title--month',
    optionExp: '.add__type option[value="exp"]',
    optionInc: '.add__type option[value="inc"]',
  };
  const formatNumber = (num, type) => {
    let numSplit, int, dec;
    num = Math.abs(num).toFixed(2);
    numSplit = num.split('.');

    int = numSplit[0];
    dec = numSplit[1];

    if (int.length > 3) int = `${int.substr(0, int.length - 3)},${int.substr(int.length - 3, 3)}`;

    return `${type === 'inc' ? '+' : '-'} ${int}.${dec}`;
  };
  const nodeListForEach = (list, callback) => {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };
  return {
    getDOMString: () => {
      return DOMStrings;
    },
    addListItem: (obj, type) => {
      let html, newHtml, element;
      // Create HTML file
      if (type === 'inc') {
        element = document.querySelector(DOMStrings.incomeContainer);
        html = `
                <div class="item clearfix" id="inc-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">%value%</div>
                        <div class="item__delete">
                            <button class="item__edit--btn"><ion-icon name="create-outline"></ion-icon></button>
                            <button class="item__delete--btn"><ion-icon name="close-circle-outline"></ion-icon></button>
                        </div>
                    </div>
                </div>`;
      } else if (type === 'exp') {
        element = document.querySelector(DOMStrings.expensesContainer);
        html = `
                <div class="item clearfix" id="exp-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">%value%</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__edit--btn"><ion-icon name="create-outline"></ion-icon></button>
                            <button class="item__delete--btn"><ion-icon name="close-circle-outline"></ion-icon></button>
                        </div>
                    </div>
                </div>`;
      };
      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      // Inser the HTML into the DOM
      element.insertAdjacentHTML('beforeend', newHtml);
    },
    clearFields: () => {
      let fields;
      fields = document.querySelectorAll(
        `${DOMStrings.inputDescription}, ${DOMStrings.inputValue}`
      );
      fieldsArr = Array.from(fields);

      fieldsArr.forEach((cur) => (cur.value = ''));
      fieldsArr[0].focus();
    },
    deleteListItem: (id) => {
      let el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },
    displayBudget: (obj) => {
      let type;
      obj.budget >= 0 ? (type = 'inc') : (type = 'exp');

      document.querySelector( DOMStrings.budgetLabel ).textContent = formatNumber(obj.budget, type);
      document.querySelector( DOMStrings.incomeLabel ).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector( DOMStrings.expensesLabel ).textContent = formatNumber(obj.totalExp, 'exp');

      if (obj.percentage && obj.percentage > 0) {
        document.querySelector( DOMStrings.percentageLabel ).textContent = `${obj.percentage}%`;
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }
    },
    displayPercentages: (percentages) => {
      let fields = document.querySelectorAll(DOMStrings.expensesListLabel);
      nodeListForEach(fields, (cur, index) => {
        percentages[index] > 0 ? cur.textContent = `${percentages[index]}%`: cur.textContent = '---';
      });
    },
    changedType: () => {
      let fields = document.querySelectorAll(`
            ${DOMStrings.inputType},
            ${DOMStrings.inputDescription},
            ${DOMStrings.inputValue}`);

      nodeListForEach(fields, (cur) => cur.classList.toggle('red-focus'));

      document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
      document.querySelector(DOMStrings.editBtn).classList.toggle('red');
    },
    editItem: (data, type, itemID) => {
      document.querySelector(DOMStrings.inputDescription).value = data.description;
      document.querySelector(DOMStrings.inputValue).value = data.value;
      document.querySelector(DOMStrings.editContainer).value = itemID;

      document.querySelector(`.add__type option[selected]`).removeAttribute('selected');
      document.querySelector(`.add__type option[value=${type}]`).setAttribute('selected', '');

      return document.querySelector(`.add__type option`).hasAttribute('selected');
    },
    showOrHideEdit: (display) => {
      document.querySelector(DOMStrings.editBtn).style.display = display;
      document.querySelector(DOMStrings.cancelBtn).style.display = display;
      document.querySelector(DOMStrings.inputBtn).style.display = display === 'none' ? 'inline-block' : 'none';
    },
    cancelEdit: () => {
      const value = document.querySelector(DOMStrings.optionExp).hasAttribute('selected');
      if (value) document.querySelector(DOMStrings.optionInc).setAttribute('selected', '');
      return value
    },
    displayMonth: () => {
      let now, month, year, months;
      months = [
        'January', 'February', 'March',
        'April', 'May', 'June',
        'July', 'August', 'September', 
        'October', 'November','December'
      ];
      now = new Date();
      [month, year] = [now.getMonth(), now.getFullYear()];

      document.querySelector(DOMStrings.monthLabel).textContent = `${months[month]} ${year}`;
    },
    getInput: () => {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
      };
    },
    printBudgety: () => {
      const addContainer = document.querySelector(DOMStrings.addContainer);
      addContainer.style.display = 'none';
      window.print();
      addContainer.style.display = 'block';
    },
  };
})();
//GLOBAL APP CONTROLLER
const controller = ((budgetCtrl, UICtrl) => {
  //Events Listeners
  const setupEventListeners = () => {
    let DOM;
    DOM = UICtrl.getDOMString();
    //Add items
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keyup', (e) => {
      if (e.keyCode === 13 || e.which === 13) ctrlAddItem();
    });
    //Edit Item
    document.querySelector(DOM.editBtn).addEventListener('click', ctrlEditItem);
    document.querySelector(DOM.cancelBtn).addEventListener('click', ctrlCancelEdit);

    document.querySelector(DOM.container).addEventListener('click', (e) => {
      if (e.target.matches('.item__delete--btn, .item__delete--btn *')) ctrlDeleteItem(e);
      if (e.target.matches('.item__edit--btn, .item__edit--btn *')) ctrlStylesEditItem(e);
    });

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    //save data in localStorage
    window.addEventListener('load', () => {
      ctrlStorage('inc');
      ctrlStorage('exp');
    });
    //print Budget
    document.querySelector(DOM.printBtn).addEventListener('click', UICtrl.printBudgety);
  };
  const updateBudget = () => {
    let budget;
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();
    // 2. Return the budget
    budget = budgetCtrl.getBudget();
    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  const updatePercentages = () => {
    // 1. Calculate the percentages
    budgetCtrl.calculatePercentages();
    // 2. Read percentages from the budget controller
    let percentages = budgetCtrl.getPercentages();
    // Display the percentages on the UI
    UICtrl.displayPercentages(percentages);
  };
  const ctrlAddItem = () => {
    let input, newItem;
    // Get input field
    input = UICtrl.getInput();
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // change income value
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      // Clear the input fields
      UICtrl.clearFields();
      // Calculate and update budget
      updateBudget();
      // Calculate and update percentages
      updatePercentages();
      // Save data with localStorage
      budgetCtrl.persistData();
    }
  };
  const getId = (itemID) => {
    let splitID, type, ID;
    splitID = itemID.split('-');
    type = splitID[0];
    ID = parseInt(splitID[1]);
    return [type, ID];
  };

  const ctrlDeleteItem = (e) => {
    let itemID, type, ID;
    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      [type, ID] = getId(itemID);
      // Delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);
      // Delete the item from the UICtrl
      UICtrl.deleteListItem(itemID);
      // Update and show the new budget
      updateBudget();
      // Calculate and update percentages
      updatePercentages();
      // Save data with localStorage
      budgetCtrl.persistData();
    }
  };
  const ctrlStylesEditItem = (e) => {
    let itemID, type, ID;
    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      [type, ID] = getId(itemID);
      // Get data from the input
      const data = budgetCtrl.setItemInput(type, ID);
      // Set values to inputs
      const hasSelect = UICtrl.editItem(data, type, itemID);
      if (hasSelect === true && type === 'inc') UICtrl.changedType();
      if (hasSelect === false && type === 'exp') UICtrl.changedType();
      // Show edit button
      UICtrl.showOrHideEdit('inline-block');
    }
  };
  const ctrlEditItem = () => {
    let itemID, type, ID;
    itemID = document.querySelector('.id__container').value;
    [type, ID] = getId(itemID);
    // Delete the item from the data structure
    budgetCtrl.deleteItem(type, ID);
    // Delete the item from the UICtrl
    UICtrl.deleteListItem(itemID);
    // add the new item
    ctrlAddItem();
    // Hide edit button
    UICtrl.showOrHideEdit('none');
  };
  const ctrlCancelEdit = () => {
    // Clear the input fields
    UICtrl.clearFields();
    // Hide edit button
    UICtrl.showOrHideEdit('none');
    const hasSelect = UICtrl.cancelEdit();
    if (hasSelect) UICtrl.changedType();
  };
  const ctrlStorage = (type) => {
    // Get data
    const allItems = budgetCtrl.readStorage();
    // Create items
    allItems[type].forEach((item) => {
      // Add the item to the UI
      let newItem = budgetCtrl.addItem(type, item.description, item.value);
      UICtrl.addListItem(newItem, type);
      // Calculate and update budget
      updateBudget();
      // Calculate and update percentages
      updatePercentages();
    });
  };
  return {
    init: () => {
      setupEventListeners(),
        UICtrl.displayBudget({
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percentage: -1,
        }),
        UICtrl.displayMonth();
    },
  };
})(budgetContoller, UIController);

controller.init();