import { terms } from "./data.js";  // Assuming terms are imported from an external file

// Einfaches Beispiel von semantischer Ähnlichkeit basierend auf Wortübereinstimmungen
const similarity = (term1, term2) => {
    let commonWords = 0;
    const words1 = term1.toLowerCase().split(" ");
    const words2 = term2.toLowerCase().split(" ");

    words1.forEach((word1) => {
        if (words2.includes(word1)) {
            commonWords++;
        }
    });

    // Berechne die Ähnlichkeit als Verhältnis der gemeinsamen Wörter
    return commonWords / Math.max(words1.length, words2.length);
};

// Knoten und Kanten für das Netzwerk
const nodes = [];
const edges = [];

// Erstelle Knoten für jeden Begriff
terms.forEach((term, index) => {
    nodes.push({ id: index, label: term });
});

// Berechne die Ähnlichkeiten und erstelle Kanten
for (let i = 0; i < terms.length; i++) {
    for (let j = i + 1; j < terms.length; j++) {
        const sim = similarity(terms[i], terms[j]);
        if (sim > 0.4) { // Verbindungen nur bei hoher Ähnlichkeit (über 0.3)
            edges.push({
                from: i,
                to: j,
             // Stärke der Verbindung (je höher die Ähnlichkeit, desto dicker)
                  
            });
        }
    }
}

// Netzwerk-Daten
const data = {
    nodes: nodes,
    edges: edges,
};

// Optionen für das Netzwerk
const options = {
    physics: {
        enabled: true,
        repulsion: 20000, // Erhöht den Abstand zwischen den Knoten
    },
    interaction: {
        zoomView: true, // Aktiviert das Zoomen
        dragView: true, // Aktiviert das Verschieben der Ansicht
    },
    edges: {
        width: 2,
        color: { inherit: true },
        smooth: { type: "continuous" },
    },
    nodes: {
        shape: "dot",
        size: 15,
        font: { size: 12 },
    },
    manipulation: {
        enabled: false, // Deaktiviert Manipulation, um es einfacher zu handhaben
    },
    configure: {
        enabled: false, // Verhindert, dass Benutzer Konfigurationen vornehmen
    },
};

// Erstelle das Netzwerk
const container = document.getElementById("network");
const network = new vis.Network(container, data, options);

// Event-Listener für Zoomänderungen
network.on("zoom", function (properties) {
    const zoomLevel = properties.scale;
    console.log("Aktueller Zoom-Level: " + zoomLevel);

    // Dynamisch Anpassungen beim Zoomen
    const newSize = Math.max(10, 10 / zoomLevel);  // Ändert die Knotengröße basierend auf dem Zoom-Level
    const newFontSize = Math.max(10, 14 / zoomLevel);  // Verändert die Schriftgröße basierend auf dem Zoom-Level

    network.setOptions({
        nodes: {
            size: newSize,
            font: { size: newFontSize },  // Setzt die Schriftgröße basierend auf dem Zoom-Level
        },
    });
});

// Suche-Funktion hinzufügen
const searchInput = document.getElementById("search-input");  // Das Suchfeld muss im HTML vorhanden sein

// Event-Listener für die Suche
searchInput.addEventListener("input", function (event) {
    const query = event.target.value.toLowerCase();  // Die Suche wird nicht zwischen Groß- und Kleinschreibung unterscheiden

    // Alle Knoten zurücksetzen
    nodes.forEach((node, index) => {
        network.body.data.nodes.update({ id: index, color: { background: "#97C2FC" } });  // Standardfarbe für Knoten
    });

    // Wenn die Eingabe leer ist, keine Filterung vornehmen
    if (query === "") return;

    // Suche nach Übereinstimmungen und Highlight der Knoten
    nodes.forEach((node, index) => {
        if (node.label.toLowerCase().includes(query)) {
            network.body.data.nodes.update({ id: index, color: { background: "#FF6347" } });  // Knoten hervorheben
        }
    });

    // Highlighten der Kanten, die mit den gefundenen Knoten verbunden sind
    edges.forEach((edge) => {
        const fromNode = nodes[edge.from];
        const toNode = nodes[edge.to];

        if (fromNode.label.toLowerCase().includes(query) || toNode.label.toLowerCase().includes(query)) {
            network.body.data.edges.update({ id: edge.id, color: { color: "#FF6347" } });  // Kante hervorheben
        }
    });
});
