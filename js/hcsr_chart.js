// Dweet.io 
const thingName = "assistive_test";

// Charts Initialization
const chart = Highcharts.chart('chart-distance', {
    chart: { type: 'line', animation: true },
    title: { text: '' },
    series: [{ name: 'Distance (cm)', data: [] }],
    xAxis: { 
        type: 'datetime', 
        title: { text: 'Time' },
        labels: { 
            formatter: function() {
                return Highcharts.dateFormat('%H:%M:%S', this.value);
            } 
        }
    },
    yAxis: { title: { text: 'Distance (cm)' }, min: 0 },
    credits: { enabled: false },
});

// Fetch data from Dweet.io
async function fetchDweetData() {
    try {
        const response = await fetch(`https://dweet.io/get/latest/dweet/for/${thingName}`);
        const data = await response.json();

        // Extract distance value
        const dweet = data.with[0]; // The latest dweet
        const distance = dweet.content.distance ?? 0; // Default to 0 if undefined
        const max_distance = dweet.content.max_distance ?? 0;
        const accelerometer = dweet.content.acc ?? 0;
        const gyro = dweet.content.gyro ?? 0;
        const timestampUTC = new Date(dweet.created).getTime();
        const timestampWIB = timestampUTC + 7 * 60 * 60 * 1000;

        // Update the distance display
        document.getElementById('distance').textContent = distance.toFixed(2);
        //document.getElementById('max_distance').textContent = max_distance.toFixed(2);
        //document.getElementById('accelerometer').textContent = accelerometer.toFixed(2);
        //document.getElementById('gyro').textContent = gyro.toFixed(2);

        // Define danger message based on distance
        let dangerObject = "";
        let dangerFall = "";
        let fall_acc_threshold = 40000.0;
        let fall_gyro_threshold = 10000.0;
        //let max_distance = 10; // Maximum safe distance

        if (distance <= max_distance) {
            dangerObject = "Object detected!";
        }

        if (accelerometer > fall_acc_threshold && gyro > fall_gyro_threshold) {
            dangerFall = "Fall Detected!";
          }

        document.getElementById('dangerObject').textContent = dangerObject;
        document.getElementById('dangerFall').textContent = dangerFall;

        // Update the chart
        if (chart.series[0].data.length > 40) {
            chart.series[0].addPoint([timestampWIB, distance], true, true);
        } else {
            chart.series[0].addPoint([timestampWIB, distance], true, false);
        }
    } catch (error) {
        console.error("Error fetching Dweet.io data:", error);
        document.getElementById('distance').textContent = "Error";
    }
}

// Fetch data periodically
setInterval(fetchDweetData, 1200); // Fetch every 1.2 seconds

console.log('Fetched data:', data);

