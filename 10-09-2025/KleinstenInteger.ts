// Ursprüngliches Array mit positiven und negativen Ganzzahlen
const array = [-13, 0, 5, -2, 8, -1, -21, -50, -3, -8, -144,5,3,2,1, 203, 34, 55, 89, 144];

// Erklärung der nächsten Zeile:
// 1) array.filter(num => num > 0)
//    - filtert alle Elemente heraus, die größer als 0 sind (also nur positive Zahlen).
//    - ergibt in diesem Beispiel [5, 8].
// 2) .reduce((a, b) => Math.abs(a - 0) < Math.abs(b - 0) ? a : b)
//    - reduziert das gefilterte Array zu einem einzigen Wert.
//    - für zwei Elemente a und b wird verglichen, welcher von beiden näher an 0 liegt.
//      Dazu wird Math.abs(x - 0) verwendet, also der absolute Abstand zur 0.
//    - Es wird das Element zurückgegeben, das den kleineren absoluten Abstand zur 0 hat.
//    - Bei mehreren Elementen läuft reduce paarweise durch das Array, sodass am Ende
//      die positive Zahl übrig bleibt, die am nächsten an 0 liegt.
// Hinweis: Wenn keine positive Zahl im Array ist, wirft reduce hier einen Fehler,
// weil reduce auf einem leeren Array ohne Startwert nicht aufgerufen werden kann.
const res = array
	.filter(num => num > 0) // nur positive Zahlen behalten
	.reduce((a, b) => Math.abs(a - 0) < Math.abs(b - 0) ? a : b); // die positivste Zahl nahe 0 wählen

// Ausgabe des Ergebnisses in die Konsole
console.log(res);