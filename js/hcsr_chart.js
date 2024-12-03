// Dweet.io "thing" name
const thingName = "assistive_test";

// Highcharts Initialization
const chart = Highcharts.chart('chart-distance', {
    chart: { type: 'line', animation: true },
    title: { text: 'HC-SR04 Real-Time Distance' },
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

// Function to fetch data from Dweet.io
async function fetchDweetData() {
    try {
        const response = await fetch(`https://dweet.io/get/latest/dweet/for/${thingName}`);
        const data = await response.json();

        // Extract distance value
        const dweet = data.with[0]; // The latest dweet
        const distance = dweet.content.distance ?? 0; // Default to 0 if undefined
        const timestampUTC = new Date(dweet.created).getTime();
        const timestampWIB = timestampUTC + 7 * 60 * 60 * 1000;

        // Update the distance display
        document.getElementById('distance').textContent = distance.toFixed(2);

        // Define danger message based on distance
        let danger = "";
        let max_distance = 10; // Maximum safe distance
        if (distance <= max_distance) {
            danger = "Object detected!";
        }
        document.getElementById('danger').textContent = danger;

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
