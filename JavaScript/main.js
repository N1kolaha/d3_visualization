document.addEventListener("DOMContentLoaded", function() {
    showTable('build', buildings);

    let button = d3.select("#start");
    let clicked = false;
    button.on("click",function(){
        if(clicked){
            d3.select("#build")
            .style("visibility","visible");
            button.text("Скрыть таблицу");
            
    }
        if(!clicked){
        d3.select("#build")
        .style("visibility","collapse");
        button.text("Показать таблицу");     
}
clicked = !clicked;


    })
    let button2 = d3.select("#draw");
    button2.on("click", function(){
        let check1 = d3.select("#check1").node().checked;
        let check2 = d3.select("#check2").node().checked;
        if(!check1 && !check2){
            alert("Выберите значение по OY");
        }

        else drawGraph(buildings);
    })
 })