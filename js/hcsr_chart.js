// Dweet.io "thing" name
const thingName = "assistive_test";

// Highcharts Initialization
const chart = Highcharts.chart('chart-distance', {
    chart: { type: 'line', animation: true },
    title: { text: 'HC-SR04 Real-Time Distance' },
    series: [{ name: 'Distance (cm)', data: [] }],
    xAxis: { type: 'datetime', title: { text: 'Time' } },
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
    const distance = dweet.content.distance;
    const danger = dweet.content.danger;
    const timestamp = new Date(dweet.created).getTime();

    // Update the distance display
    document.getElementById('distance').textContent = distance.toFixed(2);
    document.getElementById('danger').textContent = danger;

    // Update the chart
    if (chart.series[0].data.length > 40) {
        chart.series[0].addPoint([timestamp, distance], true, true);
    } else {
        chart.series[0].addPoint([timestamp, distance], true, false);
    }
    } catch (error) {
    console.error("Error fetching Dweet.io data:", error);
    document.getElementById('distance').textContent = "Error";
    }
}

// Fetch data periodically
setInterval(fetchDweetData, 1200); // Fetch every 5 seconds