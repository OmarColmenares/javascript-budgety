//BUDGET CONTROLLER
var budgetContoller = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calculatePercentage =  function(totalInc){
        if(totalInc > 0){
            this.percentage = Math.round((this.value/totalInc) * 100);
        }else{
            this.percentage = -1;
        };
    };
    Expense.prototype.getPercentages = function(){
        return this.percentage;
    }
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(cur => {
            sum += cur.value;
        });
        data.totals[type] = sum;
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
            if(data.allItems[type].length > 0) {
                //Busca el ultimo elemento del array y le suma 1
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            }else{
                ID = 0;
            }
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
            return newItem;
        },
        deleteItem: function(type, id){
            var ids, index;
            ids = data.allItems[type].map((cur) =>{
                return cur.id;
            });
            // ids[0, 1, 2, 3, 4, 5, 6] 
            index =  ids.indexOf(id);

            if(index !== -1) {
                data.allItems[type].splice(index, 1);
                
            };
        },
        testing: function() {
            console.log(data);
        },
        calculateBudget: function(){
            // Calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            //Calculate the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100 ) ;
            }  else{
                data.percetage = -1
            };
        },
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur) {
                var z = cur.calculatePercentage(data.totals.inc);
            });
        },
        getPercentages: function(){
            var allPerc = data.allItems.exp.map((cur) => {
                return cur.percentage;
            });
            return allPerc;
        },
        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesListLabel: '.item__percentage',
        monthLabel: '.budget__title--month'
    };
    var formatNumber = function(num, type){
        var numSplit, int, dec, type;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');

        int = numSplit[0];
        dec = numSplit[1];

        if(int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);

        };

        return (type === 'inc' ? '+' : '-') + ' ' + int + '.' + dec
    };
    
    var nodeListForEach = function(list, callback){
        for(let i = 0; i < list.length; i++){
            callback(list[i], i);
        };
    };
    return {
        getDOMString:function(){
            return DOMStrings;
        },
        addListItem:function(obj, type){
            var html, newHtml, element;
            // Create HTML file
            if(type === 'inc'){
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
                </div>`
            }else if(type === 'exp'){
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
                </div>`
            };
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type)) ;
            // Inser the HTML into the DOM
            //element.innerHTML = newHtml
            element.insertAdjacentHTML('beforeend', newHtml)
        },
        clearFields:function(){
            var fields;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach( cur => {
                cur.value = "";
            });

            fieldsArr[0].focus();
        },
        deleteListItem: function(id) {
            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },
        displayBudget: function(obj){
            var type;

            obj.budget >= 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp ,'exp');
            if(obj.percentage && obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            };
        },
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMStrings.expensesListLabel);
            nodeListForEach(fields, (cur, index) => {
                if(percentages[index] > 0){
                    cur.textContent = percentages[index] + '%';
                }else{
                    cur.textContent = '---';
                };
            });
        },
        changedType: function(){
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' + 
                DOMStrings.inputDescription + ',' + 
                DOMStrings.inputValue);

            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
            //console.log('cambiando...');
        },
        displayMonth: function(){
            var now, month, year, months
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            now = new Date();
            month = now.getMonth()
            year = now.getFullYear();
            document.querySelector(DOMStrings.monthLabel).textContent = months[month] + ' ' + year;
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
        var DOM;
        DOM = UICtrl.getDOMString();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keyup', (e) =>{
            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem();
            };

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
        });
    };
    var updateBudget = function (){
        var budget;
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        // 2. Return the budget
        budget = budgetCtrl.getBudget();
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    var updatePercentages = function() {
        // 1. Calculate the percentages
        budgetCtrl.calculatePercentages();
        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        // Display the percentages on the UI
        UICtrl.displayPercentages(percentages);
    }
    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get input field
         input = UICtrl.getInput();
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
        // 2. change income value
         newItem = budgetCtrl.addItem(input.type,input.description,input.value);

         // 3. Add the item to the UI
         UICtrl.addListItem(newItem, input.type);
 
         // 4. Clear the input fields
         UICtrl.clearFields();

         // 5. Calculate and update budget
         updateBudget();

         // 6.  Calculate and update percentages
         updatePercentages();
        } 
    };
    var ctrlDeleteItem = function(e) {
        var itemID, splitID, type, ID;
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID) {
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
        };
    };
    return {
        init: function(){
            setupEventListeners(),
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            UICtrl.displayMonth();
        }
    }
})(budgetContoller, UIController);

controller.init();