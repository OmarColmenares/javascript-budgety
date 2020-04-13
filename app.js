//BUDGET CONTROLLER
const budgetContoller = (() => {

    class Expense {
        constructor (id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        };

        calculatePercentage(totalInc) {
            this.percentage = totalInc > 0 ? Math.round((this.value / totalInc) * 100) : -1;
        };

        getPercentages() {
            return this.percentage;
        };
    };

    class Income{
        constructor (id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        };
    };

    const calculateTotal = type => {
        let sum = 0;
        data.allItems[type].forEach(cur => sum += cur.value);
        data.totals[type] = sum;
    };
    //data structure
    let data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return{
        addItem: (type, desc, val) => {
            let newItem, ID;
            //Create new ID
            if(data.allItems[type].length > 0) {
                //Busca el ultimo elemento del array y le suma 1
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            }else{
                ID = 0;
            }
            //Create new Item
            type === 'inc' ? newItem = new Income(ID, desc, val) :  newItem = new Expense(ID, desc, val);

            //Push it into our data structure
            data.allItems[type].push(newItem);
            // Return the new element
            return newItem;
        },
        deleteItem:(type, id) => {
            let ids, index;
            ids = data.allItems[type].map(cur =>  cur.id);
            index =  ids.indexOf(id);

            if(index !== -1) data.allItems[type].splice(index, 1);
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
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100 );
            }  else {
                data.percetage = -1;
            };
        },
        calculatePercentages: () => {
            data.allItems.exp.forEach(cur => cur.calculatePercentage(data.totals.inc));
        },
        getPercentages: () => {
            //let allPerc = data.allItems.exp.map(cur => cur.percentage);
            return data.allItems.exp.map(cur => cur.percentage);
        },
        getBudget:() => {
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        persistData: () => {
            localStorage.setItem('data', JSON.stringify(data.allItems));
        },
        readStorage: () => {
            let items = JSON.parse(localStorage.getItem('data', data.allItems));
            if(items) {
                items.allItems = items;
                return items;
            };
        },
    };
})();
//UI CONTROLLER
const UIController = (() => {
    const DOMStrings = {
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        printBtn: '.print__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        addContainer: '.add__container',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesListLabel: '.item__percentage',
        monthLabel: '.budget__title--month'
    };
    const formatNumber = (num, type) => {
        let numSplit, int, dec;
        num = Math.abs(num).toFixed(2);
        numSplit = num.split('.');

        int = numSplit[0];
        dec = numSplit[1];

        if(int.length > 3) int = `${int.substr(0, int.length - 3)},${int.substr(int.length - 3, 3)}`;

        return `${type === 'inc' ? '+' : '-'} ${int}.${dec}`
    };

    const nodeListForEach = (list, callback) => {
        for(let i = 0; i < list.length; i++){
            callback(list[i], i);
        };
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
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
            }else if (type === 'exp') {
                element = document.querySelector(DOMStrings.expensesContainer);
                html = `
                <div class="item clearfix" id="exp-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">%value%</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
            };
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type)) ;
            // Inser the HTML into the DOM
            //element.innerHTML = newHtml
            element.insertAdjacentHTML('beforeend', newHtml);
        },
        clearFields: () => {
            let fields;
            fields = document.querySelectorAll(`${DOMStrings.inputDescription}, ${DOMStrings.inputValue}`);
            fieldsArr = Array.from(fields);

            fieldsArr.forEach(cur => cur.value = '');
            fieldsArr[0].focus();
        },
        deleteListItem: id => {
            let el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },
        displayBudget: obj => {
            let type;
            obj.budget >= 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp ,'exp');

            if(obj.percentage && obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = `${obj.percentage}%`;
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            };
        },
        displayPercentages: percentages => {
            let fields = document.querySelectorAll(DOMStrings.expensesListLabel);
            nodeListForEach(fields, (cur, index) => {
                percentages[index] > 0 ? cur.textContent = `${percentages[index]}%` : cur.textContent = '---';
            });
        },
        changedType: () => {
            let fields = document.querySelectorAll(`
            ${DOMStrings.inputType},
            ${DOMStrings.inputDescription},
            ${DOMStrings.inputValue}`);

            nodeListForEach(fields, cur => cur.classList.toggle('red-focus'));

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },
        displayMonth: () => {
            let now, month, year, months
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            now = new Date();
            [month, year] = [now.getMonth(), now.getFullYear()];

            document.querySelector(DOMStrings.monthLabel).textContent = `${months[month]} ${year}`;
        },
        getInput: () => {
            return{
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
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keyup', e => {
            if(e.keyCode === 13 || e.which === 13) ctrlAddItem()
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

        window.addEventListener('load', () => {
            ctrlStorage('inc');
            ctrlStorage('exp');
        });

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
        // 1. Get input field
         input = UICtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
        // 2. change income value
         newItem = budgetCtrl.addItem(input.type,input.description,input.value);
         // 3. Add the item to the UI
         UICtrl.addListItem(newItem, input.type);
         // 4. Clear the input fields
         UICtrl.clearFields();
         // 5. Calculate and update budget
         updateBudget();
         // 6. Calculate and update percentages
         updatePercentages();
        } 
        //set storage
        budgetCtrl.persistData()
    };
    const ctrlDeleteItem = e => {
        let itemID, splitID, type, ID;
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt( splitID[1] );
            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            // 2. Delete the item from the UICtrl
            UICtrl.deleteListItem(itemID);
            // 3. Update and show the new budget
            updateBudget();
            // 4.  Calculate and update percentages
            updatePercentages();
            //set storage
            budgetCtrl.persistData()
        };
    };
    const ctrlStorage = type => {
         //get data
         const allItems = budgetCtrl.readStorage()
         //loop data
        allItems[type].forEach(item => {
            // 3. Add the item to the UI
            let newItem = budgetCtrl.addItem(type,item.description,item.value);
            UICtrl.addListItem(newItem, type);
            // 5. Calculate and update budget
            updateBudget();
            // 6. Calculate and update percentages
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
                percentage: -1
            }),
            UICtrl.displayMonth()
        }
    };
})(budgetContoller, UIController);

controller.init();