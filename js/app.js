"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = "https://nbaserver-q21u.onrender.com/api/filter";
    const selectPositionElm = document.querySelector("select");
    const pointsInputElm = document.querySelector("#pointsInput");
    const twoPercentInputElm = document.querySelector("#twoPercentInput");
    const threePercentInputElm = document.querySelector("#threePercentInput");
    const searchButton = document.querySelector("#search-btn");
    const tableBody = document.querySelector("tbody");
    const playerDivs = {
        PG: document.getElementById("pg"),
        SG: document.getElementById("sg"),
        SF: document.getElementById("sf"),
        PF: document.getElementById("pf"),
        C: document.getElementById("c"),
    };
    // functions
    const searchPlayers = async () => {
        const searchInfo = {
            position: selectPositionElm.value,
            twoPercent: Number(twoPercentInputElm.value),
            threePercent: Number(threePercentInputElm.value),
            points: Number(pointsInputElm.value),
        };
        console.log("Search Info:", searchInfo);
        try {
            const res = await fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(searchInfo),
            });
            if (!res.ok) {
                throw new Error("HTTP error! status: ${res.status}");
            }
            const resArray = await res.json();
            console.log("Players found: ", resArray.length);
            displayResults(resArray);
        }
        catch (error) {
            console.error("Error Fetching players:", error);
        }
    };
    const displayResults = (players) => {
        tableBody.innerHTML = "";
        players.forEach((player) => {
            const row = document.createElement("tr");
            const nameCell = document.createElement("td");
            nameCell.textContent = player.playerName;
            row.appendChild(nameCell);
            const positionCell = document.createElement("td");
            positionCell.textContent = player.position;
            row.appendChild(positionCell);
            const threePercentCell = document.createElement("td");
            threePercentCell.textContent = player.threePercent.toString();
            row.appendChild(threePercentCell);
            const twoPercentCell = document.createElement("td");
            twoPercentCell.textContent = player.twoPercent.toString();
            row.appendChild(twoPercentCell);
            const pointsCell = document.createElement("td");
            pointsCell.textContent = player.points.toString();
            row.appendChild(pointsCell);
            const actionsCell = document.createElement("td");
            const addPlayerBtn = document.createElement("button");
            addPlayerBtn.textContent = `add ${player.playerName.trim().split(" ")[0]} to current team`;
            addPlayerBtn.classList.add("add-player");
            addPlayerBtn.addEventListener("click", () => addPlayerToTeam(player));
            actionsCell.appendChild(addPlayerBtn);
            row.appendChild(actionsCell);
            tableBody.appendChild(row);
        });
    };
    const addPlayerToTeam = (player) => {
        const playerDiv = playerDivs[player.position];
        if (playerDiv) {
            const playerInfoDiv = playerDiv.querySelector(".player-info");
            if (playerInfoDiv) {
                playerInfoDiv.innerHTML = "";
                const name = document.createElement("p");
                name.classList.add("player-name");
                name.textContent = player.playerName;
                playerInfoDiv.appendChild(name);
                const stats = document.createElement("div");
                stats.classList.add("player-stats");
                const pointsStat = document.createElement("p");
                pointsStat.classList.add("stat");
                pointsStat.textContent = `Points: ${player.points}`;
                stats.appendChild(pointsStat);
                const twoPStat = document.createElement("p");
                twoPStat.classList.add("stat");
                twoPStat.textContent = `2P: ${player.twoPercent.toFixed(2)}%`;
                stats.appendChild(twoPStat);
                const threePStat = document.createElement("p");
                threePStat.classList.add("stat");
                threePStat.textContent = `3P: ${player.threePercent.toFixed(2)}%`;
                stats.appendChild(threePStat);
                playerInfoDiv.appendChild(stats);
                console.log(`Added ${player.playerName} as the team's ${player.position}`);
            }
            else {
                console.error("Player info div not found", { player, playerDiv });
            }
        }
        else {
            console.error("Player div not found for position", player.position);
        }
    };
    // search button event listener
    searchButton.addEventListener("click", searchPlayers);
});
