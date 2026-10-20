let events = [];
let scheduleDates = [];

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
        title,
        date,
        start,
        end,
        color
    });

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

    for(let d=0; d<days; d++){

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

    container.appendChild(calendar);

    renderEvents(
        startHour
    );
}

function renderEvents(startHour){

    events.forEach(event=>{

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

        card.innerText =
            event.title;

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