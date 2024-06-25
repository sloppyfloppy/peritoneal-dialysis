function validateForm() {

    // Clear previous error messages
    document.querySelectorAll('.error').forEach(function(error) {
        error.textContent = '';
        hasErrors = false;
    });

    var deadNight = document.getElementById('deadNight').value;
    var deadDay = document.getElementById('deadDay').value;
    var ufNight = document.getElementById('ufNight').value;
    var ufDay = document.getElementById('ufDay').value;
    var mtac = document.getElementById('mtac').value;
    var volume = document.getElementById('volume').value;
    var gen = document.getElementById('gen').value;
    kr = document.getElementById('kr').value;
    var days = document.querySelectorAll('input[name="day"]:checked');
    var hasErrors = false;

    // Check deadNight
    if (deadNight.trim() === '') {
        document.getElementById('deadNightError').textContent = 'A number is required';
        hasErrors = true;
    } else if (isNaN(deadNight)) {
        document.getElementById('deadNightError').textContent = 'A number is required';
        hasErrors = true;
    } else if (deadNight < 0){
        document.getElementById('deadNightError').textContent = 'Number has to be greater or equal to 0';
        hasErrors = true;
    }

    // Check deadDay
    if (deadDay.trim() === '') {
        document.getElementById('deadDayError').textContent = 'A number is required';
        hasErrors = true;
    } else if (isNaN(deadDay)) {
        document.getElementById('deadDayError').textContent = 'A number is required';
        hasErrors = true;
    } else if (deadDay < 0) {
        document.getElementById('deadDayError').textContent = 'Number has to be greater or equal to 0';
        hasErrors = true;
    }
    
    // Check ufNight
    if (ufNight.trim() === '') {
        document.getElementById('ufNightError').textContent = 'A number is required';
        hasErrors = true;
    } else if (isNaN(ufNight)) {
        document.getElementById('ufNightError').textContent = 'A number is required';
        hasErrors = true;
    } else if (ufNight < 0) {
        document.getElementById('ufNightError').textContent = 'Number has to be greater or equal to 0';
        hasErrors = true;
    }

    // Check ufDay
    if (ufDay.trim() === '') {
        document.getElementById('ufDayError').textContent = 'A number is required';
        hasErrors = true;
    } else if (isNaN(ufDay)) {
        document.getElementById('ufDayError').textContent = 'A number is required';
        hasErrors = true;
    } else if (ufDay < 0) {
        document.getElementById('ufDayError').textContent = 'Number has to be greater or equal to 0';
        hasErrors = true;
    }

    // Check if at least one day is selected
    if (days.length === 0) {
        document.getElementById('daysError').textContent = 'Please select at least one day';
        hasErrors = true;
    }

    // Check mtac
    if (mtac.trim() === '') {
        document.getElementById('mtacError').textContent = 'A number is required';
        hasErrors = true;
    } else if (isNaN(mtac)) {
        document.getElementById('mtacError').textContent = 'A number is required';
        hasErrors = true;
    } else if (mtac < 0) {
        document.getElementById('mtacError').textContent = 'Number has to be greater or equal to 0';
        hasErrors = true;
    }

    // Check volume 
    if (volume.trim() === '') {
        document.getElementById('volumeError').textContent = 'A number is required';
        hasErrors = true;
    } else if (isNaN(volume)) {
        document.getElementById('volumeError').textContent = 'A number is required';
        hasErrors = true;
    } else if (volume < 0) {
        document.getElementById('volumeError').textContent = 'Number has to be greater or equal to 0';
        hasErrors = true;
    }

    // Check gen 
    if (gen.trim() === '') {
        document.getElementById('genError').textContent = 'A number is required';
        hasErrors = true;
    } else if (isNaN(gen)) {
        document.getElementById('genError').textContent = 'A number is required';
        hasErrors = true;
    } else if (gen < 0) {
        document.getElementById('genError').textContent = 'Number has to be greater or equal to 0';
        hasErrors = true;
    }

    // Check kr
    if (kr.trim() === '') {
        document.getElementById('krError').textContent = 'A number is required';
        hasErrors = true;
    } else if (isNaN(kr)) {
        document.getElementById('krError').textContent = 'A number is required';
        hasErrors = true;
    } else if (kr < 0) {
        document.getElementById('krError').textContent = 'Number has to be greater or equal to 0';
        hasErrors = true;
    }

    if (!hasErrors){
        submitForm();
    }
}

async function submitForm() {
    var deadNight = parseFloat(document.getElementById('deadNight').value);
    var deadDay = parseFloat(document.getElementById('deadDay').value);
    var ufDay = parseFloat(document.getElementById('ufDay').value);
    var ufNight = parseFloat(document.getElementById('ufNight').value);
    var mtac = parseFloat(document.getElementById('mtac').value);
    var volume = parseFloat(document.getElementById('volume').value);
    var gen = parseFloat(document.getElementById('gen').value);
    var kr = parseFloat(document.getElementById('kr').value);
    var days = Array.from(document.querySelectorAll('input[name="day"]:checked')).map(day => day.value);

    var volumeData = [];
    var timeData = [];
    var schemeData = [];
    var totDayTime = 0;
    var totNightTime = 0;

    for (var i = 1; i <= 7; i++) {
        // Construct the ID for the current element

        var currentId = 'exVolume ' + i;
        // Get the element by its ID
        var element = document.getElementById(currentId);

        // Check if the element exists
        if (element) {
            volumeValue = element.value;
            // Parse the element's text content into a float value and push it into the volumeData array
            // Check if the parsed value is a valid float
            if (volumeValue != 0){ // If it's a valid float
                volumeData.push(volumeValue); // Push the float value into the volumeData array
            }
        }

        var currentId = 'exTime ' + i;
        var element = document.getElementById(currentId);

        // Check if the element exists
        if (element) {
            timeValue = parseFloat(element.value);
            // Parse the element's text content into a float value and push it into the volumeData array
            // Check if the parsed value is a valid float
            if (timeValue != 0){ // If it's a valid float
                timeData.push(timeValue); // Push the float value into the volumeData array
            }
        }

        var currentId = 'exScheme ' + i;
        var element = document.getElementById(currentId);

        // Check if the element exists
        if (element) {
            schemeValue = element.value;
            // Parse the element's text content into a float value and push it into the volumeData array
            // Check if the parsed value is a valid float
            if (schemeValue != 'None'){ // If it's a valid float
                schemeData.push(schemeValue); // Push the float value into the volumeData array
            }
            if (schemeValue == "Night"){
                totNightTime = totNightTime + timeValue - deadNight;
            }
            else if (schemeValue == "Day"){
                totDayTime = totDayTime + timeValue - deadDay;
            }
        }
    }
    try {
    
        const [plasmaConcentration, volumeofDistribution, peakConcentration, dialysateConcentration, volDialysate] = await pdCalculator(deadNight, deadDay, ufNight, ufDay, volumeData, timeData, schemeData, days, totDayTime, totNightTime, mtac, volume, kr, gen);
        updateGraphVar(plasmaConcentration, volumeofDistribution, dialysateConcentration, volDialysate)
        updateNumerical(plasmaConcentration, peakConcentration, gen, volumeofDistribution)

        const graphVarRadios = document.querySelectorAll('input[name="variable"]');
        graphVarRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                updateGraphVar(plasmaConcentration, volumeofDistribution, dialysateConcentration, volDialysate);
            });
        });

        const graphZoomRadios = document.querySelectorAll('input[name="zoom"]');
        graphZoomRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                updateGraphVar(plasmaConcentration, volumeofDistribution, dialysateConcentration, volDialysate);
            });
        });

        const graphAvgRadios = document.querySelectorAll('input[name="add"]');
        graphAvgRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                updateGraphVar(plasmaConcentration, volumeofDistribution, dialysateConcentration, volDialysate);
            });
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

function defaultInput() {

    var deadNight = 0.25;
    var deadDay = 0.25;
    var ufNight = 0.9;
    var ufDay = 0.3;
    var mtac = 19.09;
    var volume = 42;
    var gen = 8000;
    var kr = 2;

    var checkboxes = document.querySelectorAll('.days-of-week input[type="checkbox"]');
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = true;
    });
    var days = document.querySelectorAll('input[name="day"]:checked');
    volumeData = [2.5, 2.5, 2.5, 2, 2.3];
    timeData = [2.67, 2.67, 2.66, 12, 4];
    schemeData = ["Night", "Night", "Night", "Day", "Day"];

    var totDayTime = 16;
    var totNightTime = 8;

    displayDefaultValues(deadNight, deadDay, ufNight, ufDay, mtac, volume, gen, kr);
}

function displayDefaultValues(deadNight, deadDay, ufNight, ufDay, mtac, volume, gen, kr){
    document.getElementById('deadNight').value = deadNight;
    document.getElementById('deadDay').value = deadDay;
    document.getElementById('ufNight').value = ufNight;
    document.getElementById('ufDay').value = ufDay;
    document.getElementById('mtac').value = mtac;
    document.getElementById('volume').value = volume;
    document.getElementById('gen').value = gen;
    document.getElementById('kr').value = kr;

    // Set default values for volumeData, timeData, and schemeData
    for (var i = 0; i < volumeData.length; i++) {
        document.getElementById('exVolume ' + (i + 1)).value = volumeData[i];
        document.getElementById('exTime ' + (i + 1)).value = timeData[i];
        document.getElementById('exScheme ' + (i + 1)).value = schemeData[i];
    }
}


function defaultAddInfo(){
    var mtac = 19.09;
    var volume = 42;
    var gen = 8000;
    var kr = 0;
    displayDefaultAddInfoValues(mtac, volume, gen, kr)
}


function displayDefaultAddInfoValues(mtac, volume, gen, kr){
    document.getElementById('mtac').value = mtac;
    document.getElementById('volume').value = volume;
    document.getElementById('gen').value = gen;
    document.getElementById('kr').value = kr;
}


function pdCalculator(deadNight, deadDay, ufNight, ufDay, volumeData, timeData, schemeData, days, totDayTime, totNightTime, mtac, volume, kr, gen){
    gen = gen / (24*60);
    var numExchange = volumeData.length;
    var numOfTreatment = days.length;
    let plasmaConcentration = new Array(7 * 24 * 60).fill(0);
    let peakConcentration = new Array(numExchange * numOfTreatment).fill(0);
    let dialysateConcentration = new Array(7 * 24 * 60).fill(0);
    let volumeofDistribution = new Array(7 * 24 * 60).fill(0);
    let volDialysate = new Array(7 * 24 * 60).fill(0);
    let amountDialysate = new Array(7 * 24 * 60).fill(0);
    let plasmaToDialysate = new Array(7 * 24 * 60).fill(0);
    let amountBody = new Array(7 * 24 * 60).fill(0);
    let netMovtIn = new Array(7 * 24 * 60).fill(0);
    let excretion = new Array(7 * 24 * 60).fill(0);

    let initial_equilibrium_tolerance = 0.001;
    let initial_steady_state = 0;
    let initial_Concentration = 1;
    let t = 1;
    let peak_index = 0;

    let fluidAddedDay = (ufDay * 1000) / (totDayTime * 60); // mL / min
    let fluidAddedNight = (ufNight * 1000) / (totNightTime * 60); // mL / min
    let volume_intake = ((ufDay + ufNight) * 1000) / 1440; // mL/min
    var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    while (initial_steady_state == 0) {
        plasmaConcentration[0] = initial_Concentration
        dialysateConcentration[0] = 0
        volumeofDistribution[0] = volume
        amountDialysate[0] = 0
        amountBody[0] = plasmaConcentration[0] * volume * 10
        volDialysate[0] = volumeData[0] * 1000
        excretion[0] = plasmaConcentration[0] * kr / 100
        plasmaToDialysate[0] = (plasmaConcentration[0] - dialysateConcentration[0])*mtac/100
        netMovtIn[0] = gen - excretion[0] - plasmaToDialysate[0]

        // Above here is tested and should run ok - June 22nd
        for (let day = 0; day < 7; day++) {
            if (days.includes(daysOfWeek[day])) {
                for (let exchange = 0; exchange < numExchange; exchange++){
                    if (schemeData[exchange] == "Night") {
                        peakConcentration[peak_index] = plasmaConcentration[t - 1]
                        peak_index = peak_index + 1
                        
                        duration = (timeData[exchange] - deadNight) * 60
                        initialTime = t
                        
                        // Above here is tested and should run ok - June 22nd

                        if (initialTime != 1){  
                            volumeofDistribution[t] = volumeofDistribution[t - 1] + (volume_intake - fluidAddedNight)/1000
                            volDialysate[t] = volumeData[exchange] * 1000
                            plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10)
                            amountDialysate[t] = 0
                            dialysateConcentration[t] = 0
                            plasmaToDialysate[t] = (plasmaConcentration[t] - dialysateConcentration[t])*mtac/100
                            amountBody[t] = amountBody[t-1] * netMovtIn[t - 1]
                            excretion[t] = plasmaConcentration[t] * kr / 100
                            netMovtIn[t] = gen - excretion[t] - plasmaToDialysate[t]
                            t = t + 1
                        }
                        while (t < (initialTime + duration)){
                            volumeofDistribution[t] = volumeofDistribution[t - 1] + (volume_intake - fluidAddedNight)/1000
                            volDialysate[t] = volDialysate[t - 1] + fluidAddedNight
                            plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10)
                            amountDialysate[t] = amountDialysate[t - 1] + plasmaToDialysate[t - 1]
                            dialysateConcentration[t] = amountDialysate[t] / volDialysate[t] * 100
                            plasmaToDialysate[t] = (plasmaConcentration[t] - dialysateConcentration[t])*mtac/100
                            amountBody[t] = amountBody[t-1] * netMovtIn[t - 1]
                            excretion[t] = plasmaConcentration[t] * kr / 100
                            netMovtIn[t] = gen - excretion[t] - plasmaToDialysate[t]
                            t = t + 1
                        }

                        while (t >= (initialTime + duration) && t < (initialTime + timeData[exchange] * 60)) {
                            volumeofDistribution[t] = volumeofDistribution[t - 1] + (volume_intake)/1000
                            volDialysate[t] = 0
                            plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10)
                            amountDialysate[t] = 0
                            dialysateConcentration[t] = 0
                            plasmaToDialysate[t] = 0
                            amountBody[t] = amountBody[t-1] * netMovtIn[t - 1]
                            excretion[t] = plasmaConcentration[t] * kr / 100
                            netMovtIn[t] = gen - excretion[t]
                            t = t + 1
                        }
                    }

                    if (schemeData[exchange] == "Day") {
                        peakConcentration[peak_index] = plasmaConcentration[t - 1]
                        peak_index = peak_index + 1
                        
                        duration = (timeData[exchange] - deadDay) * 60
                        initialTime = t
                        
                        if (initialTime != 1){  
                            volumeofDistribution[t] = volumeofDistribution[t - 1] + (volume_intake - fluidAddedDay)/1000
                            volDialysate[t] = volumeData[exchange] * 1000
                            plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10)
                            amountDialysate[t] = 0
                            dialysateConcentration[t] = 0
                            plasmaToDialysate[t] = (plasmaConcentration[t] - dialysateConcentration[t])*mtac/100
                            amountBody[t] = amountBody[t-1] * netMovtIn[t - 1]
                            excretion[t] = plasmaConcentration[t] * kr / 100
                            netMovtIn[t] = gen - excretion[t] - plasmaToDialysate[t]
                            t = t + 1
                        }
                        
                        while (t < (initialTime + duration)){
                            volumeofDistribution[t] = volumeofDistribution[t - 1] + (volume_intake - fluidAddedDay)/1000
                            volDialysate[t] = volDialysate[t - 1] + fluidAddedDay
                            plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10)
                            amountDialysate[t] = amountDialysate[t - 1] + plasmaToDialysate[t - 1]
                            dialysateConcentration[t] = amountDialysate[t] / volDialysate[t] * 100
                            plasmaToDialysate[t] = (plasmaConcentration[t] - dialysateConcentration[t])*mtac/100
                            amountBody[t] = amountBody[t-1] * netMovtIn[t - 1]
                            excretion[t] = plasmaConcentration[t] * kr / 100
                            netMovtIn[t] = gen - excretion[t] - plasmaToDialysate[t]
                            t = t + 1
                        }

                        while (t >= (initialTime + duration) && t < (initialTime + timeData[exchange] * 60)) {
                            volumeofDistribution[t] = volumeofDistribution[t - 1] + (volume_intake)/1000
                            volDialysate[t] = 0
                            plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10)
                            amountDialysate[t] = 0
                            dialysateConcentration[t] = 0
                            plasmaToDialysate[t] = 0
                            amountBody[t] = amountBody[t-1] * netMovtIn[t - 1]
                            excretion[t] = plasmaConcentration[t] * kr / 100
                            netMovtIn[t] = gen - excretion[t]
                            t = t + 1
                        }
                    }
                }   
            }
            else{
                tfinal = t + 24*60
                peakConcentration[peak_index] = plasmaConcentration[t-1]
                peak_index  = peak_index + 1

                while (t < tfinal){
                    volumeofDistribution[t] = volumeofDistribution[t - 1] + (volume_intake)/1000
                    volDialysate[t] = 0
                    plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10)
                    amountDialysate[t] = 0
                    dialysateConcentration[t] = 0
                    plasmaToDialysate[t] = 0
                    amountBody[t] = amountBody[t-1] * netMovtIn[t - 1]
                    excretion[t] = plasmaConcentration[t] * kr / 100
                    netMovtIn[t] = gen - excretion[t]
                    t = t + 1
                }
            }
            console.log('day, t', day, t)
        }
        if (Math.abs(plasmaConcentration[t - 1] - initial_Concentration) < (initial_equilibrium_tolerance * initial_Concentration)){
            initial_steady_state = 1
            console.log(plasmaConcentration)
        }
        else{
            initial_Concentration = plasmaConcentration[t - 1]
            t = 1
            peak_index = 0
        }
    } 
    return ([plasmaConcentration, volumeofDistribution, peakConcentration, dialysateConcentration, volDialysate])                  
}



function renderChart(dataSet, name, zoom, average) {
    // Set default options for all charts
    Chart.defaults.font.size = 15;
    Chart.defaults.font.family = "Manrope";

    // Check if chart exists and destroy it before rendering a new one
    var chartStatus = Chart.getChart("chartCanvas");
    if (chartStatus !== undefined) {
        chartStatus.destroy();
    }

    var data = [];

    var data1 = {        
        label: name,
        data: dataSet,
        borderColor: '#2A9D8F',
        fill: false
    };

    data.push(data1);

    if (average && dataSet.length > 0) { // Only calculate average if dataSet is not empty
        var sum = dataSet.reduce((acc, value) => acc + value, 0);
        var avg = sum / dataSet.length;

        var data2 = {
            label: "Average",
            data: Array(dataSet.length).fill(avg),
            borderColor: '#E76F51',
            fill: false
        };

        data.push(data2);
    }

    const labels = Array.from({ length: dataSet.length }, (_, i) => i.toString()); // Adjust as needed

    var options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (minutes)'
                },
                min: 0,
                ticks: {
                    maxTicksLimit: 10,
                    font: {
                        family: "Manrope",
                        size: 15
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: name
                },
                ticks: {
                    beginAtZero: true,
                    font: {
                        family: "Manrope",
                        size: 15
                    }
                },
                min: zoom
            }
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        family: 'Manrope', // font for legend labels
                        size: 15,
                        style: 'normal',
                        lineHeight: 1.2
                    }
                }
            }
        }
    };

    // Get the canvas context and create the chart instance
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    var linechart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: data
        },
        options: options
    });
}


function updateNumerical(plasmaConcentration, peakConcentration, gen, volumeofDistribution) {
    if (plasmaConcentration.length === 0) avg = 0; // Handle empty array case

    var sum = plasmaConcentration.reduce((plasmaConcentration, value) => plasmaConcentration + value, 0);
    var avg = sum / plasmaConcentration.length;

    document.getElementById('avgConc').innerText = avg.toFixed(2);

    if (peakConcentration.length === 0) avg = 0; // Handle empty array case

    var sum = peakConcentration.reduce((peakConcentration, value) => peakConcentration + value, 0);
    var avgPeak = sum / peakConcentration.length; 
    
    document.getElementById('avgPeakConc').innerText = avgPeak.toFixed(2);

    gen = gen / (24*60)

    var effClearAvg = gen / avg * 100;
    var effClearPeak = gen / avgPeak * 100;

    document.getElementById('effClearAvgConc').innerText = effClearAvg.toFixed(2);
    document.getElementById('effClearPeakConc').innerText = effClearPeak.toFixed(2);


    if (volumeofDistribution.length === 0) avg = 0; // Handle empty array case

    var sum = volumeofDistribution.reduce((volumeofDistribution, value) => volumeofDistribution + value, 0);
    var avgVol = sum / volumeofDistribution.length; 

    document.getElementById('avgVolume').innerText = avgVol.toFixed(2);

}

function updateGraphVar(plasmaConcentration, volumeofDistribution, dialysateConcentration, volDialysate){
    var selectedVar = document.querySelector('input[name="variable"]:checked').value;
    var zoom = document.querySelector('input[name="zoom"]:checked').value;
    var average = document.querySelector('input[name="add"]:checked').value;

    if (zoom === "Zoomed In"){
        zoom = 'auto';
    }
    else if (zoom === "Zoomed Out"){
        zoom = 0;
    }

    if (average === "Add Avg"){
        avg = true
    }
    else if (average === "No Avg"){
        avg = false
    }

    if (selectedVar === "Plasma Concentration"){
        renderChart(plasmaConcentration, "Plasma Concentration (mg/L)", zoom, avg)
    }
    else if (selectedVar === "Volume of Distribution"){
        renderChart(volumeofDistribution, "Volume of Distribution (L)", zoom, avg)
    }
    else if (selectedVar === "Dialysate Concentration"){
        renderChart(dialysateConcentration, "Dialysate Concentration (mg/L)", zoom, avg)
    }

    else if (selectedVar === "Dialysate Volume"){
        renderChart(volDialysate, "Dialysate Volume (L)", zoom, avg)
    }
}