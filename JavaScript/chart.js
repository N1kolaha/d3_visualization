// Входные данные:
//   data - исходный массив (например, buildings)
//   key - поле, по которому осуществляется группировка

function createArrGraph(data, key) {  
  
    groupObj = d3.group(data, d => d[key]);

    let arrGraph =[];
    for(let entry of groupObj) {
        let minMax = d3.extent(entry[1].map(d => d['Высота']));
        arrGraph.push({labelX : entry[0], values : minMax});
     }

     return arrGraph;
}
function drawGraph(data) {
    // значения по оси ОХ    
    //const keyX = "Страна"; 

    //*** 
   let keyX =  d3.select('input[name="ox"]:checked').node().value;


    // создаем массив для построения графика
    const arrGraph = createArrGraph(data, keyX);
    
    let svg = d3.select("svg")  
    svg.selectAll('*').remove();

   // создаем словарь с атрибутами области вывода графика
   attr_area = {
        width: parseFloat(svg.style('width')),
        height: parseFloat(svg.style('height')),
        marginX: 50,
        marginY: 50
   }
       
    // создаем шкалы преобразования и выводим оси
    const [scX, scY] = createAxis(svg, arrGraph, attr_area);
    
    // рисуем график
    let sel = d3.select("#type").node().value;
    sel=="first" ? 
    createChartGist(svg, arrGraph, scX, scY, attr_area, "red"):
    createChartDot(svg, arrGraph, scX, scY, attr_area, "red");
            
       
}
function createAxis(svg, data, attr_area){
    // находим интервал значений, которые нужно отложить по оси OY 
    // максимальное и минимальное значение и максимальных высот по каждой стране
//*** 
  let  [min, max] = d3.extent(data.map(d => d.values[1]));
   


    // функция интерполяции значений на оси
    // по оси ОХ текстовые значения


    //*** 
    let keyX =  d3.select('input[name="ox"]:checked').node().value;
    let scaleX = d3.scaleBand()
    .domain(data.map(d => d.labelX))
    .range([0, attr_area.width - 2 * attr_area.marginX]);
if(keyX=="Год"){
     scaleX = d3.scaleBand()
                    .domain(data.map(d => d.labelX).sort())
                    .range([0, attr_area.width - 2 * attr_area.marginX]);
}
                    
     let scaleY = d3.scaleLinear()
                    .domain([min * 0.85, max * 1.1 ])
                    .range([attr_area.height - 2 * attr_area.marginY, 0]);               
     
     // создание осей
    let axisX = d3.axisBottom(scaleX); // горизонтальная 
    let axisY = d3.axisLeft(scaleY); // вертикальная

    // отрисовка осей в SVG-элементе
    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, 
                                      ${attr_area.height - attr_area.marginY})`)
        .call(axisX)
        .selectAll("text") // подписи на оси - наклонные
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", d => "rotate(-45)");
    
    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .call(axisY);
        
    return [scaleX, scaleY]
}
function createChartGist(svg, data, scaleX, scaleY, attr_area, color) {
    const r = 4;
    //*** 
    let check1 = d3.select("#check1").node().checked;
    let check2 = d3.select("#check2").node().checked;
    if(check1 &&check2 ){
       createGist(svg, data, scaleX, scaleY, attr_area, "red",d => scaleY(d.values[1]),2);
       createGist(svg, data, scaleX, scaleY, attr_area, "blue",d => scaleY(d.values[0]),-2);


        
    }
    else if(check1){
        createGist(svg, data, scaleX, scaleY, attr_area, "red",d => scaleY(d.values[1]));

    }
   else if(check2){
    createGist(svg, data, scaleX, scaleY, attr_area, "blue",d => scaleY(d.values[0]));

        }
}
function createChartDot(svg, data, scaleX, scaleY, attr_area, color) {
   
//*** 
let check1 = d3.select("#check1").node().checked;
let check2 = d3.select("#check2").node().checked;
if(check1 && check2){

    createDot(svg, data, scaleX,  attr_area, "red",d => scaleY(d.values[1]),2);

    createDot(svg, data, scaleX,  attr_area, "blue",d => scaleY(d.values[0]),-2);
}

else if(check1){
    createDot(svg, data, scaleX,  attr_area, "red",d => scaleY(d.values[1]));
}
else if(check2){
    createDot(svg, data, scaleX,  attr_area, "blue",d => scaleY(d.values[0]));
}
}

function createDot(svg, data, scaleX,  attr_area, color,value,shift=0){
    const r = 4;
    svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", r)
    .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2+shift)
    .attr("cy", value)
    .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
    .style("fill", color)

}
function createGist(svg, data, scaleX, scaleY, attr_area, color,value,shift=0){
    svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("line")
    .attr("x1", d => scaleX(d.labelX) + scaleX.bandwidth() / 2+shift )
    .attr("y1", value)
    .attr("x2", d => scaleX(d.labelX) + scaleX.bandwidth() / 2+shift )
    .attr("y2",  scaleY.range()[0])
    .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
    .attr("stroke", color)
    .attr("stroke-width", 3)
}