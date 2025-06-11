const TABLE_COLUMN_ACTIVE_CLASS = [
    {   
        key: "className", 
        label: 'Class Name',
        thStyle: 'width: 70%'
    },
    {   
        key: "invited", 
        label: 'Invited',
        thStyle: 'width: 10%'
    },
    {   
        key: "notSubmitted", 
        label: 'Not Submitted',
        thStyle: 'width: 10%'
    },
    {   
        key: "submitted", 
        label: 'Submitted',
        thStyle: 'width: 10%'
    },
]

const TABLE_COLUMN_PARTICIPANTS = [
    {   
        key: "index", 
        label: 'No',
        thStyle: 'width: 5%'
    },
    {   
        key: "userName", 
        label: 'Nama',
        thStyle: 'width: 45%'
    },
    {   
        key: "classroomName", 
        label: 'Kelas',
        thStyle: 'width: 45%'
    },
    {   
        key: "score", 
        label: 'Rata-Rata',
        thStyle: 'width: 5%'
    },
]

const TABLE_COLUMN_SUBMISSIONS = [
    {   
        key: "index", 
        label: 'No',
        thStyle: 'width: 10%'
    },
    {   
        key: "userName", 
        label: 'Name',
        thStyle: 'width: 30%'
    },
    {   
        key: "topicTitle", 
        label: 'Nama Tugas',
        thStyle: 'width: 30%'
    },
    {   
        key: "submitted_at", 
        label: 'Submission Date',
        thStyle: 'width: 30%'
    },
    {   
        key: "classroomName", 
        label: 'Test name',
        thStyle: 'width: 30%'
    },
]

const CHART_PROPS_FUNNEL = {
    data: {
        labels: [ 
            ['Participants', 'Invited'], 
            'Submitted', 
            'Non-Zero', 
            ['Good', 'perfomance'], 
        ],
        datasets: [ 
            { 
                borderColor: '#5e72e4',
                backgroundColor: 'rgb(94, 114, 228, .5)',
                data: [],
                fill: true,
                tension: 0.1
            } 
        ],
    },
    options: {
        responsive: true,
        legend: {
            display: false,
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }],
        },
    },
    height: 400,
    isBusy: false
}

const CHART_PROPS_SUBMISSION_RATE = {
    data: {
        labels: [ 
            'Mengumpulkan',
            'Tidak Mengumpulkan' 
        ],
        datasets: [ 
            { 
                backgroundColor: ['#5e72e4', '#2dce89', '#8898aa'],
                data: [] 
            } 
        ],
    },
    options: {
        responsive: true,
        legend: {
            display: true,
            position: 'bottom'
        },
    },
    isBusy: false
}

const CHART_PROPS_MONITOR = {
    data: {
        labels: [],
        datasets: [ 
            { 
                backgroundColor: '#5e72e4',
                data: [] 
            } 
        ],
    },
    options: {
        responsive: true,
        legend: {
            display: false,
        },
    },
    isBusy: false
}

const CHART_PROPS_DAILY_LOGIN = {
    data: {
        labels: [],
        datasets: [
            {
                borderColor: '#0E9CFF',
                fill: true,
                backgroundColor: 'rgba(14, 156, 255, 0.2)',
                pointBorderColor: '#0E9CFF',
                pointBorderWidth: 2,
                pointStyle: 'circle',
                data: []
            }
        ],
        options: {
            responsive: true,
            legend: {
                display: false,
            },
        },
        isBusy: false
    }
}

const CHART_PROPS_VISITOR = {
    data: {
        labels: [],
        datasets: [ 
            { 
                borderColor: '#9747FF',
                backgroundColor: 'transparent',
                pointBorderColor: '#BA7967',
                pointBorderWidth: 2,
                pointStyle: 'circle',
                data: [],
                fill: true,
                tension: 0.1
            } 
        ],
        options: {
            responsive: true,
            legend: {
                display: true,
                labels: {
                    usePointStyle: true,
                },
                position: 'bottom'
            },
        },
        isBusy: false
    }
}


const CHART_PROPS_VISITED_CLASS = {
    data: {
        type: 'bar',
        labels: [],
        datasets: [ 
            { 
                borderColor: '#5e72e4',
                backgroundColor: '#0042AB',
                data: [],
                fill: true,
                tension: 0.1
            } ,
            { 
                borderColor: '#5e72e4',
                backgroundColor: '#0E9CFF',
                data: [],
                fill: true,
                tension: 0.1
            } 
        ],
        options: {
            responsive: true,
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    usePointStyle: true,
                },
            },
            scales: {
                xAxes: [{

                    ticks: {
                        maxTicksLimit: 10,
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 0,
                        callback: function(value) {
                            let words = value.split(/\s+/); // split label text into words
                            let maxCharsPerLine = 20; // maximum number of characters per line
                            let lines = [];
                            let currentLine = words[0];
                            
                            for (let i = 1; i < words.length; i++) {
                                let word = words[i];
                                if (currentLine.length + 1 + word.length <= maxCharsPerLine) {
                                currentLine += ' ' + word; // add word to current line
                                } else {
                                lines.push(currentLine); // push current line to lines array
                                currentLine = word; // start new line with current word
                                }
                            }
                            lines.push(currentLine); // push last line to lines array
                            
                            return lines; // return array of lines
    
                        }
                    }
                }],
                
                yAxes: {
                    beginAtZero: true
                }
            }     
        },
        isBusy: false
    }
}



const CHART_PROPS_PROGRAM_PARTICIPANTS = {
    data: {
        type: 'bar',
        labels: [],
        datasets: [ 
            {
                borderColor: '#5e72e4',
                backgroundColor: '#7460EA',
                data: [],
                fill: true,
                tension: 0.1
            },
            {
                borderColor: '#5e72e4',
                backgroundColor: '#F4CAE4',
                data: [],
                fill: true,
                tension: 0.1
            },
            {
                borderColor: '#5e72e4',
                backgroundColor: '#AB7CE5',
                data: [],
                fill: true,
                tension: 0.1
            },
        ],
        // options: {
        //     responsive: true,
        //     legend: {
        //         display: true,
        //         position: "bottom",
        //         labels: {
        //             usePointStyle: true,
        //             padding: 25,
        //         },
        //     },
        //     tooltips: {
        //         callbacks: {
        //             title: function(tooltipItem, data){
        //                 const listLabel = [];
        //                 tooltipItem.forEach((item) => {
        //                     const label = data.labels[item.index];
        //                     const match = label.match(/\(\d+\)/);

        //                     const determineIndex = label.indexOf(match[0]);
        //                     const firstText = label.substring(0, determineIndex).trim();
        //                     listLabel.push(firstText);
        //                 });
        //                 const labels = Array.from(new Set(listLabel));
        //                 return labels.join(", ");
        //             },
        //             label: function(tooltipItem, data) {
        //                 const listData = data.datasets[tooltipItem.datasetIndex].data;
        //                 const currentData = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
        //                 const subArr = listData.slice(0, tooltipItem.index)
        //                 const label = data.datasets[tooltipItem.datasetIndex].label;
        //                 const splitArr = label.split("(");
        //                 if(!subArr.includes(0) && currentData === 0 ){
        //                     return `${splitArr[0].trim()} : ${tooltipItem.value}`;
        //                 }else if(currentData !== 0 ){
        //                     return `${splitArr[0].trim()} : ${tooltipItem.value}`;
        //                 }
        //             }
        //         }
        //     },
        //     scale: {
        //         ticks: {
        //             beginAtZero: true,
        //             stepSize: 5,
        //         },
        //         pointLabels: {
        //             fontColor: '',
        //             fontSize: 12,
        //             fontStyle: "bold",
        //             callback: function(label, index, labels) {
        //                 const match = label.match(/\(\d+\)/);
        //                 const determineIndex = label.indexOf(match[0]);

        //                 const firstText = label.substring(0, determineIndex).trim();
        //                 const secondText = label.substring(determineIndex);

        //                 return firstText.length > 11 ? firstText.substr(0, 11) + '... ' + secondText : label;
        //             }   
        //         }
        //     }
        // },
        options: {
            responsive: true,
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    usePointStyle: true,
                },
            },
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: {
                    stacked: true,
                    beginAtZero: true
                }
            }     
        },
        isBusy: false
    }
}
// const CHART_PROPS_PROGRAM_PARTICIPANTS = {
//     data: {
//         type: 'doughnat',
//         labels: [],
//         datasets: [ 
//             { 
//                 data: [],
//                 fill: true,
//                 backgroundColor: [
//                     '#7460EA',
//                     '#F4CAE4',
//                     '#AB7CE5',
//                   ],
              
//             } 
//         ],
//         options: {
//             responsive: true,
//             legend: {
//                 display: false,
//                 labels: {
//                     usePointStyle: true,
//                 },
//             },
//         },
//         isBusy: false
//     }
// }


const CHART_PROPS_ATTENDANCE_PERCENTAGE = {
    data: {
        labels: [ 
            'Tidak hadir' ,
            'Hadir'
        ],
        datasets: [ 
            { 
                backgroundColor: ['#ab7ce5', '#7460ea'],
                data: [] 
            } 
        ],
    },
    options: {
        responsive: true,
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                usePointStyle: true,
            },
        },
        plugins: {
            doughnutlabel: {
                labels: [
                    {
                        text: '',
                        font: {
                            size: 32,
                            weight: 'bold'
                        },
                        color: '#000000'
                    }
                ]
            }
        }
    },
    isBusy: false
}


const CHART_PROPS_ATTENDANCE_MEET = {
    data: {
        labels: [ 
            'Tidak hadir' ,
            'Hadir'
        ],
        datasets: [ 
            { 
                backgroundColor: ['#cbb6f8', '#ab7ce5'],
                data: [] 
            } 
        ],
    },
    options: {
        responsive: true,
        legend: {
            display: true,
            position: 'right',
            labels: {
                usePointStyle: true,
            },
        },
        plugins: {
            doughnutlabel: {
                labels: [
                    {
                        text: '',
                        font: {
                            size: 28,
                            weight: 'bold'
                        },
                        color: '#000000'
                    }
                ]
            }
        },
    },
    isBusy: false
}


const CHART_PROPS_ATTEND = {
    data: {
        labels: [],
        datasets: [ 
            { 
                borderColor: '#9747FF',
                backgroundColor: 'transparent',
                pointBorderColor: '#BA7967',
                pointBorderWidth: 2,
                pointStyle: 'circle',
                data: [],
                fill: true,
                tension: 0.1
            } 
        ],
        options: {
            responsive: true,
            legend: {
                display: true,
                labels: {
                    usePointStyle: true,
                },
            },
        },
        isBusy: false
    }
}


export {
    CHART_PROPS_VISITED_CLASS,
    CHART_PROPS_DAILY_LOGIN,
    CHART_PROPS_SUBMISSION_RATE,
    CHART_PROPS_FUNNEL,
    CHART_PROPS_MONITOR,
    CHART_PROPS_VISITOR,
    CHART_PROPS_PROGRAM_PARTICIPANTS,
    TABLE_COLUMN_ACTIVE_CLASS,
    TABLE_COLUMN_PARTICIPANTS,
    TABLE_COLUMN_SUBMISSIONS,
    CHART_PROPS_ATTENDANCE_PERCENTAGE,
    CHART_PROPS_ATTEND,
    CHART_PROPS_ATTENDANCE_MEET,
}