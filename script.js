let mobileDayIndex = 0;
let events =
    JSON.parse(
        localStorage.getItem("events")
    ) || [];

let scheduleDates = [];

let editingEventId = null;

const HOUR_HEIGHT = 60;

function toggleEventForm(){

    document
      .getElementById("eventForm")
      .classList
      .toggle("hidden");
}

function convertToMinutes(time){

    const [h,m] =
        time.split(":").map(Number);

    return h * 60 + m;
}

function formatTimeInput(input){

    let value =
        input.value
             .replace(/\D/g,'');

    if(value.length === 4){

        input.value =
            value.slice(0,2)
            + ":"
            + value.slice(2);
    }
}

function formatDate(date){

    return `${date.getMonth()+1}/${date.getDate()}`;
}

function updateDateSelect(){

    const select =
        document.getElementById(
            "eventDate"
        );

    select.innerHTML = "";

    scheduleDates.forEach(date=>{

        const option =
            document.createElement("option");

        option.value = date;
        option.textContent = date;

        select.appendChild(option);
    });
}

function saveEvent(){

    const title =
        document.getElementById(
            "eventTitle"
        ).value;

    const date =
        document.getElementById(
            "eventDate"
        ).value;

    const start =
        document.getElementById(
            "eventStart"
        ).value;

    const end =
        document.getElementById(
            "eventEnd"
        ).value;

    const color =
        document.getElementById(
            "eventColor"
        ).value;

    if(!title){

        alert("予定名を入力してください");
        return;
    }

   events.push({

    id: Date.now(),

    title,
    date,
    start,
    end,
    color

});

saveEvents();
document.getElementById(
    "eventStart"
).value =
document.getElementById(
    "startTime"
).value;

document.getElementById(
    "eventEnd"
).value =
document.getElementById(
    "startTime"
).value;
    generateSchedule();
}

function generateSchedule(){

    const startDate =
        document.getElementById(
            "startDate"
        ).value;

    const days =
        parseInt(
            document.getElementById(
                "days"
            ).value
        );

    const startTime =
        document.getElementById(
            "startTime"
        ).value;

    const endTime =
        document.getElementById(
            "endTime"
        ).value;

    if(!startDate) return;

    const container =
        document.getElementById(
            "scheduleContainer"
        );

    container.innerHTML = "";

    scheduleDates = [];

    const calendar =
        document.createElement("div");

    calendar.className =
        "calendar";

    const timeColumn =
        document.createElement("div");

    timeColumn.className =
        "time-column";

    const blank =
        document.createElement("div");

    blank.style.height = "40px";

    timeColumn.appendChild(blank);

    const startHour =
        parseInt(startTime.split(":")[0]);

    const endHour =
        parseInt(endTime.split(":")[0]);

    for(
        let h=startHour;
        h<=endHour;
        h++
    ){

        const time =
            document.createElement("div");

        time.className =
            "time-cell";

        time.textContent =
            `${String(h).padStart(2,"0")}:00`;

        timeColumn.appendChild(time);
    }

    calendar.appendChild(timeColumn);

    const baseDate =
        new Date(startDate);
const isMobile =
    window.innerWidth <= 768;

const startDay =
    isMobile
    ? mobileDayIndex
    : 0;

const endDay =
    isMobile
    ? Math.min(
        mobileDayIndex + 1,
        days
      )
    : days;
    for(
    let d=startDay;
    d<endDay;
    d++
){


        const date =
            new Date(baseDate);

        date.setDate(
            baseDate.getDate()+d
        );

        const iso =
          date.toISOString()
              .split("T")[0];

        scheduleDates.push(iso);

        const dayColumn =
            document.createElement("div");

        dayColumn.className =
            "day-column";

        const header =
            document.createElement("div");

        header.className =
            "day-header";

        header.textContent =
            formatDate(date);

        dayColumn.appendChild(header);

        const body =
            document.createElement("div");

        body.className =
            "day-body";

        body.dataset.date = iso;

        for(
            let h=startHour;
            h<=endHour;
            h++
        ){

            const row =
                document.createElement("div");

            row.className =
                "hour-row";

            body.appendChild(row);
        }

        dayColumn.appendChild(body);

        calendar.appendChild(dayColumn);
    }

    updateDateSelect();

generateTimeOptions();

container.appendChild(
    calendar
);
    
    generateTimeOptions();

    container.appendChild(calendar);

    renderEvents(
        startHour
    );
}

function renderEvents(startHour){

    events.forEach(event=>{

        const overlappingEvents =
    events.filter(e => {

        if(e.id === event.id){
            return false;
        }

        if(e.date !== event.date){
            return false;
        }

        const eventStart =
            convertToMinutes(
                event.start
            );

        const eventEnd =
            convertToMinutes(
                event.end
            );

        const otherStart =
            convertToMinutes(
                e.start
            );

        const otherEnd =
            convertToMinutes(
                e.end
            );

        return (
            eventStart < otherEnd &&
            eventEnd > otherStart
        );

    });

        const body =
            document.querySelector(
                `[data-date="${event.date}"]`
            );

        if(!body) return;

        const start =
            convertToMinutes(
                event.start
            );

        const end =
            convertToMinutes(
                event.end
            );

        const top =
            start -
            (startHour * 60);

        const height =
            end - start;

        const card =
            document.createElement("div");

        card.className =
            "event-card";

        card.style.background =
            event.color;

        card.style.top =
            `${top}px`;

        card.style.height =
            `${height}px`;
        const overlapCount =
    overlappingEvents.length + 1;

if(overlapCount > 1){

    const allOverlapEvents =
        [event, ...overlappingEvents]
        .sort((a,b)=>
            a.id - b.id
        );

    const columnIndex =
        allOverlapEvents.findIndex(
            e => e.id === event.id
        );

    const width =
        100 / overlapCount;

    card.style.width =
        `calc(${width}% - 8px)`;

    card.style.left =
        `${width * columnIndex}%`;

}else{

    card.style.width =
        "calc(100% - 16px)";

    card.style.left =
        "8px";
}

card.innerHTML = `
<div class="card-title">
    ${event.title}
</div>

<div class="card-time">
    ${event.start}〜${event.end}
</div>
`;
            card.style.cursor = "pointer";

card.onclick = () => {

    openModal(event.id);

};

        body.appendChild(card);
    });
}

window.onload = ()=>{

    const today =
        new Date();

    document
      .getElementById(
        "startDate"
      )
      .value =
      today
        .toISOString()
        .split("T")[0];

    generateSchedule();
};
function saveEvents(){

    localStorage.setItem(
        "events",
        JSON.stringify(events)
    );
}
function openModal(id){

    const event =
        events.find(
            e => e.id === id
        );

    if(!event) return;

    editingEventId = id;

    document.getElementById(
        "editTitle"
    ).value = event.title;

    document.getElementById(
        "editStart"
    ).value = event.start;

    document.getElementById(
        "editEnd"
    ).value = event.end;

    document.getElementById(
        "editColor"
    ).value = event.color;

    document.getElementById(
        "editModal"
    ).classList.remove(
        "hidden"
    );
}

function closeModal(){

    document.getElementById(
        "editModal"
    ).classList.add(
        "hidden"
    );
}
function saveEdit(){

    const event =
        events.find(
            e => e.id === editingEventId
        );

    if(!event) return;

    event.title =
        document.getElementById(
            "editTitle"
        ).value;

    event.start =
        document.getElementById(
            "editStart"
        ).value;

    event.end =
        document.getElementById(
            "editEnd"
        ).value;

    event.color =
        document.getElementById(
            "editColor"
        ).value;

    saveEvents();

    closeModal();

    generateSchedule();
}
function deleteEvent(){

    if(
        !confirm(
            "削除しますか？"
        )
    ){
        return;
    }

    events =
        events.filter(
            e =>
            e.id !== editingEventId
        );

    saveEvents();

    closeModal();

    generateSchedule();
}
function generateTimeOptions(){

    const list =
        document.getElementById(
            "timeOptions"
        );

    if(!list) return;

    list.innerHTML = "";

    const start =
        document.getElementById(
            "startTime"
        ).value;

    const end =
        document.getElementById(
            "endTime"
        ).value;

    const startMinutes =
        convertToMinutes(start);

    const endMinutes =
        convertToMinutes(end);

    for(
        let m=startMinutes;
        m<=endMinutes;
        m+=15
    ){

        const option =
            document.createElement(
                "option"
            );

        const h =
            Math.floor(m/60);

        const min =
            m%60;

        option.value =
            String(h)
                .padStart(2,"0")
            + ":"
            + String(min)
                .padStart(2,"0");

        list.appendChild(
            option
        );
    }
}

function prevDay(){

    if(mobileDayIndex > 0){

        mobileDayIndex--;

        generateSchedule();
    }
}

function nextDay(){

    if(
        mobileDayIndex <
        scheduleDates.length - 1
    ){

        mobileDayIndex++;

        generateSchedule();
    }
}