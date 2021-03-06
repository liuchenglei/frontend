; (function () {

    'use strict';

    window.myTable =function(...args){

        boot(...args);
        return {render};
    };

    let table, thead, tbody, structure, list, operations;

    function boot(tableSelector, struct, arr, opr) {
        table = document.querySelector(tableSelector);
        thead = table.tHead;
        tbody = table.tBodies[0];
        structure = struct;
        list = arr;
        operations = opr;
        render();
    }

    function render() {
        renderHead();
        renderBody();
    }

    function renderHead() {
        thead.innerHTML = '';
        let html = '';
        for (let key in structure) {
            html += `<th>${structure[key]}</th>`;
        }
        if (operations) {
            html += `<th>操作</th>`;
        }

        thead.innerHTML = html;
    }

    function renderBody() {
        tbody.innerHTML = '';
        list.forEach((it, i) => {
            let tr = document.createElement('tr');
            let html = '';
            for (let key in structure) {
                html += `<td>${it[key]}</td>`;
            }
            if (operations) {
                let btnHtml = '';
                for (let action in operations) {
                    //类名也是对应的key
                    btnHtml += `<button class="${action}">${action}</button>`;
                }
                html += `<td>${btnHtml}</td>`;
            }
            tr.innerHTML = html;
            //每个按钮添加功能
            if (operations) {

                for (let key in operations) {
                    //找到对应按钮的类名绑定点击事件
                    tr.querySelector('.' + key).
                        addEventListener('click', () => {
                            //把tr和索引回传回去
                            operations[key](tr,i);
                        })
                }
            }
            tbody.appendChild(tr);


        })
    }

})();

let orderStruct = {
    oid: '订单号',
    product: '商品',
    totalCost: '总费用',
};

let orders = [
    {
        oid: '001',
        product: '拖鞋',
        totalCost: 70,
    },
    {
        oid: '002',
        product: '毛裤',
        totalCost: 80,
    },
    {
        oid: '003',
        product: '枸杞',
        totalCost: 90,
    },

]
table.boot('#orderTable', orderStruct, orders,
    {
        Delete(tr,index) {
            orders[index]=null;
       
            tr.remove();
        },
       hightLine(tr) {
            let klass = tr.classList;
            let active = 'active';
            if(klass.contains(active)){
                klass.remove(active);
            }else{
                klass.add(active);
            }
            console.log('a');
        },
        //折扣价 discount
        Discount(tr,index) {
            let it = orders[index];
            let sale = it.totalCost*0.8;
           tr.cells[2].innerText = sale;
           console.dir(tr);
        },
        Up(tr,i){
            let up = i-1;
            if(up<0)
            return;

            let temp = orders[up];
            orders[up] = orders[i];
            orders[i] = temp;
            
            let brother = tr.previousElementSibling;
            if(brother)
            brother.insertAdjacentElement('beforebegin',tr);    
           
        },
        Down(tr,i){
            let down = i+1;
            if(down>orders.length)
                return;
                
            let temp = orders[down];
            orders[down] = orders[i];
            orders[i] = temp;
            
            let other = tr.nextElementSibling;
            if(other)
            other.insertAdjacentElement('afterend',tr);    
           
        }
    }
);