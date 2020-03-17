//BUDGET CONTROLLER
var budgetContoller = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value
    };
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value
    };
    var calculateTotal = function(type){
        var sum = 0
        data.allItems[type].forEach(current => {
            sum += current.value
        });
        data.totals[type] = sum
    };
    //data structure
    var data = {
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
        addItem: function(type, desc, val){
            var newItem, ID;
            //Create new ID
            // ID = data.allItems[type][data.allItems[type].length -1].id + 1
                ID = data.allItems[type].length + 1
            //Create new Item
            if(type === 'inc'){
                newItem = new Income(ID, desc, val);
                //data.allItems.inc.push(newItem);
            }else if(type === 'exp'){
                newItem = new Expense(ID, desc, val);
                //data.allItems.exp.push(newItem);
            };
            //Push it into our data structure
            data.allItems[type].push(newItem);
            // Return the new element
            return newItem
        },
        testing: function() {
            console.log(data);
        },
        calculateBudget: function(){
            // Calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp')
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            //Calculate the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100 ) 
            }  else{
                data.percetage = -1
            }
        },
        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
    }
})();
//UI CONTROLLER
var UIController = (function(){
    var DOMStrings = {
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    }
    return {
        getDOMString:function(){
            return DOMStrings;
        },
        addListItem:function(obj, type){
            console.log('adding...');
            var html, newHtml, element;
            // Create HTML file
            if(type === 'inc'){
                element = document.querySelector(DOMStrings.incomeContainer);
                html = `
                <div class="item clearfix" id="income-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">%value%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`
            }else if(type === 'exp'){
                element = document.querySelector(DOMStrings.expensesContainer);
                html = `
                <div class="item clearfix" id="expense-%%id">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">%value%</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`
            };
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            // Inser the HTML into the DOM
            //element.innerHTML = newHtml
            element.insertAdjacentHTML('beforeend', newHtml)
        },
        clearFields:function(){
            var fields;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach( current => {
                current.value = "";
            });

            fieldsArr[0].focus();
        },
        displayBudget: function(obj){
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
            if(obj.percentage){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            };
        },
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
            };
        }
    };
})();
//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
    //Events Listeners
    var setupEventListeners = function(){
        var DOM
        DOM = UICtrl.getDOMString();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keyup', (e) =>{
            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem();
            }
        });
        
    };
    var updateBudget = function (){
        var budget
        // 1. Calculatethe budget
        budgetCtrl.calculateBudget();
        // 2. Return the budget
        budget = budgetCtrl.getBudget();
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    }
    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get input field
         input = UICtrl.getInput()
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
        // 2. change income value
         newItem = budgetCtrl.addItem(input.type,input.description,input.value);

         // 3. Add the item to the UI
         UICtrl.addListItem(newItem, input.type);
 
         // 4. Clear the input fields
         UICtrl.clearFields();

         // 5. Calculate and update budget
         updateBudget();
        } 
    };
    return {
        init: function(){
            console.log('The appplication has starter');
            setupEventListeners(),
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
        }
    }
})(budgetContoller, UIController);

controller.init()