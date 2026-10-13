/* Thermofis Technikstudio — local, dependency-free software 3D renderer.
 * Models are explanatory geometry, not a dimensioned installation plan. */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const THEMES = {
    heat: {
      scene: 'Luft-Wasser-Wärmepumpe', title: 'Aus Außenluft wird Heizwärme.',
      summary: 'Eine Wärmepumpe nutzt Umweltwärme. Strom treibt den Verdichter an. Ein geschlossener Kältekreis überträgt die Wärme auf das Heizwasser.',
      note: 'Kältemittel und Heizwasser bleiben getrennt. Das Modell zeigt das Funktionsprinzip, keine konkrete Anlage.',
      alt: 'Drehbares 3D-Funktionsschema einer Luft-Wasser-Wärmepumpe. Verdampfer, Verdichter, Verflüssiger und Expansionsventil bilden den geschlossenen Kältemittelkreislauf. Heizwasser fließt in einem getrennten Kreis.',
      components: [
        { name: 'Verdampfer', text: 'Der Ventilator führt Außenluft am Wärmetauscher vorbei. Das Kältemittel nimmt Wärme auf und verdampft bei niedrigem Druck. Das funktioniert auch bei kühler Außenluft; die Leistung hängt von den Bedingungen ab.' },
        { name: 'Verdichter', text: 'Der Verdichter wird mit Strom betrieben. Er erhöht den Druck des gasförmigen Kältemittels – dabei steigt dessen Temperatur. So wird aus der aufgenommenen Umweltwärme nutzbare Heizwärme.' },
        { name: 'Verflüssiger', text: 'Das heiße Kältemittel gibt Wärme an das Heizwasser ab und wird dabei wieder flüssig. Beide Kreisläufe berühren sich am Wärmetauscher, ihre Flüssigkeiten vermischen sich nicht.' },
        { name: 'Expansionsventil', text: 'Das Ventil senkt den Druck des Kältemittels. Es kühlt ab und kann im Verdampfer erneut Wärme aus der Außenluft aufnehmen. Der geschlossene Kreislauf beginnt von vorn.' }
      ]
    },
    floor: {
      scene: 'Fußbodenheizung · Nasssystem', title: 'Wärme, die von unten kommt.',
      summary: 'Heizwasser strömt durch Rohrschleifen im Estrich. Die große Bodenfläche gibt die Wärme gleichmäßig an den Raum ab. Der Heizkreisverteiler versorgt die einzelnen Kreise.',
      note: 'Gezeigt ist ein Nasssystem mit Rohren im Estrich. Aufbauhöhe, Dämmung, Bodenbelag und Heizlast werden für Ihr Gebäude geplant.',
      alt: 'Drehbares 3D-Schnittmodell eines Nasssystems: Bodenbelag, Estrich, darin eingebettete Heizrohre, Dämmung und tragender Boden. Die Rohrschleife ist mit dem Heizkreisverteiler verbunden. Die Explosionsansicht trennt diese Schichten.',
      components: [
        { name: 'Bodenbelag', text: 'Fliesen, geeignetes Parkett oder andere freigegebene Beläge geben die Wärme an den Raum ab. Ihr Wärmedurchlasswiderstand beeinflusst, wie gut die Wärme durch den Boden gelangt.' },
        { name: 'Estrich', text: 'Im gezeigten Nasssystem umschließt der Estrich die Heizrohre. Er verteilt die Wärme, trägt den Belag und speichert Energie. Deshalb reagiert die Fußbodenheizung langsamer als ein kleiner Heizkörper.' },
        { name: 'Heizrohre', text: 'Die Rohre führen Heizwasser durch den Boden. Vom Verteiler kommt der wärmere Vorlauf; über den Rücklauf fließt das abgekühlte Wasser zurück. Rohrabstand und Wassermenge werden passend zur Heizlast ausgelegt.' },
        { name: 'Dämmung', text: 'Die Dämmschicht unter dem Heizestrich begrenzt die Wärmeabgabe nach unten. Je nach Aufbau kommen auch Trittschalldämmung und weitere Schichten hinzu.' },
        { name: 'Tragender Boden', text: 'Die Rohdecke beziehungsweise Bodenplatte trägt den gesamten Aufbau. Der gezeigte Schichtenaufbau ist ein Prinzip. Bestandsgebäude und Trockenbausysteme benötigen gegebenenfalls andere Lösungen.' },
        { name: 'Heizkreisverteiler', text: 'Hier treffen die einzelnen Heizkreise zusammen. Ventile und Durchflussanzeigen ermöglichen das Einstellen der Wassermengen. Der hydraulische Abgleich sorgt für eine passende Wärmeverteilung.' }
      ]
    },
    balance: {
      scene: 'Hydraulischer Abgleich · Prinzip', title: 'Die passende Wärme für jeden Raum.',
      summary: 'Heizwasser folgt dem Weg des geringeren Widerstands. Beim hydraulischen Abgleich werden die Wassermengen für die Heizflächen und die Einstellung der Pumpe passend zum Wärmebedarf berechnet.',
      note: 'Die Vorher-Nachher-Ansicht zeigt ein vereinfachtes Beispiel, keine gemessenen Durchflüsse. Passende Wassermengen sind je nach Raum unterschiedlich; gleiche Wassermengen sind nicht das Ziel.',
      alt: 'Drehbares 3D-Schema einer Pumpe mit drei parallel angeschlossenen Heizkörpern. Voreinstellbare Ventile begrenzen die Wassermengen passend zum Bedarf. Vorher und nachher zeigen eine symbolische Verteilung ohne Messwerte oder Einsparversprechen.',
      components: [
        { name: 'Umwälzpumpe', text: 'Die Pumpe bewegt das Heizwasser durch Vorlauf, Heizflächen und Rücklauf. Eine passende Pumpeneinstellung stellt den erforderlichen Druck bereit. Mehr Pumpenleistung allein löst eine unpassende Verteilung nicht.' },
        { name: 'Voreinstellbare Ventile', text: 'Die Voreinstellung begrenzt die Wassermenge einer Heizfläche. Kurze und lange Leitungswege sowie der Wärmebedarf werden bei der Berechnung berücksichtigt. Das Thermostat regelt anschließend die Raumtemperatur.' },
        { name: 'Heizkörper', text: 'Jeder Raum benötigt eine passende Wärmeleistung. Ohne Abgleich können nahe Heizkörper zu viel und entferntere zu wenig Wasser erhalten. Welche Heizfläche welche Wassermenge benötigt, ergibt sich aus der Fachplanung.' },
        { name: 'Passende Wassermengen', text: 'Beim Abgleich werden die benötigten Wassermengen und die Einstellungen berechnet und umgesetzt. Das Ziel ist eine bedarfsgerechte Verteilung – nicht überall derselbe Durchfluss. Vorlauftemperatur und Regelung werden mit betrachtet.' }
      ]
    },
    gas: {
      scene: 'Gasheizung · Brennwertgerät', title: 'Wärme aus Gas. Zweifach genutzt.',
      summary: 'Der Brenner erzeugt Wärme. Ein Wärmetauscher gibt sie an das Heizwasser ab. Bei ausreichend kühlem Rücklauf kondensiert zusätzlich Wasserdampf aus dem Abgas – dabei wird weitere Wärme nutzbar.',
      note: 'Vereinfachtes Brennwertprinzip. Abgas und Heizwasser bleiben getrennt. Ob eine Gasheizung für Ihr Gebäude zulässig und sinnvoll ist, klären wir individuell; das Modell ist keine Einbauempfehlung.',
      alt: 'Drehbares Schnittmodell eines Gas-Brennwertgeräts mit Brenner, Wärmetauscher, getrenntem Heizwasserkreis, Abgasführung und Kondensatablauf.',
      components: [
        {name:'Gasbrenner', text:'Gas und Verbrennungsluft werden dem Brenner zugeführt. Die geregelte Verbrennung erwärmt den Wärmetauscher. Die Flamme hat keinen direkten Kontakt mit dem Heizwasser.'},
        {name:'Wärmetauscher', text:'Metallflächen übertragen die Wärme der Verbrennung auf das Heizwasser. Bei niedrig genug temperiertem Rücklauf kann Wasserdampf im Abgas kondensieren. Diese zusätzliche Wärme nutzt die Brennwerttechnik.'},
        {name:'Heizwasserkreis', text:'Der warme Vorlauf versorgt Heizkörper oder Fußbodenheizung. Das abgekühlte Wasser kommt im Rücklauf zurück. Eine Pumpe bewegt das Wasser im geschlossenen Heizkreis.'},
        {name:'Abgas & Kondensat', text:'Das Abgas verlässt das Gerät über eine dafür geeignete Abgasleitung. Anfallendes Kondensat wird über einen gesicherten Ablauf abgeführt. Ausführung und gegebenenfalls Neutralisation plant der Fachbetrieb.'}
      ]
    },
    oil: {
      scene: 'Ölheizung · Brennwertkessel', title: 'Vom Heizöltank zur Heizwärme.',
      summary: 'Heizöl wird aus dem Tank zum Brenner gefördert, fein zerstäubt und mit Luft verbrannt. Der Kessel überträgt die Wärme auf das Heizwasser. Brennwerttechnik nutzt zusätzlich Kondensationswärme aus dem Abgas.',
      note: 'Schematischer Öl-Brennwertkessel. Tank, Abgasweg und Sicherheitsausstattung müssen fachlich geplant werden. Ob ein Einbau zulässig und sinnvoll ist, prüfen wir für das konkrete Gebäude.',
      alt: 'Drehbares Funktionsmodell einer Ölheizung mit separatem Heizöltank, Brenner, Wärmetauscher und geschlossenem Heizwasserkreis. Die Brennstoffleitung ist vom Heizwasser getrennt.',
      components: [
        {name:'Heizöltank', text:'Der Tank lagert den Brennstoff. Über die Ölleitung gelangt das Heizöl zum Brenner. Lagerung, Auffang- und Sicherheitseinrichtungen sind Teil der Fachplanung und hier nur vereinfacht dargestellt.'},
        {name:'Ölbrenner', text:'Die Brennerpumpe fördert das Öl. Eine Düse zerstäubt es, damit es sich mit Verbrennungsluft mischen und geregelt verbrennen kann. Die Brennkammer gibt Wärme an den Kessel ab.'},
        {name:'Wärmetauscher', text:'Der Wärmetauscher erwärmt das Heizwasser, ohne es mit dem Abgas zu vermischen. Bei der gezeigten Brennwerttechnik kondensiert Wasserdampf aus dem ausreichend abgekühlten Abgas und gibt zusätzliche Wärme ab.'},
        {name:'Heizkreis & Abgasweg', text:'Vorlauf und Rücklauf verbinden den Kessel mit den Heizflächen. Abgas wird separat nach außen geführt, Kondensat separat abgeleitet. Brennstoff, Heizwasser und Abgas sind unterschiedliche Stoffströme.'}
      ]
    },
    softener: {
      scene: 'Wasserenthärtung · Ionenaustausch', title: 'Weniger Härte. Weniger neue Ablagerungen.',
      summary: 'Ein Austauschharz nimmt Calcium- und Magnesiumionen aus dem Wasser auf und gibt dafür Natriumionen ab. So sinkt die Wasserhärte. Eine Salzlösung regeneriert das Harz in einem getrennten Betriebsablauf.',
      note: 'Enthärtung vermindert neue Kalkablagerungen. Sie ersetzt keine Entkalkung bereits verkalkter Bauteile. Bedarf, Zielhärte und Wartung werden auf Ihre Trinkwasserinstallation abgestimmt.',
      alt: 'Drehbares Schnittmodell einer Enthärtungsanlage: Austauschharz im Druckbehälter, Steuerventil und separater Salzbehälter. Umschaltbar zwischen Enthärtungsbetrieb und Regeneration mit getrenntem Spülwasserablauf.',
      components: [
        {name:'Hartwasserzulauf', text:'Das Trinkwasser gelangt zur Anlage. Calcium und Magnesium bestimmen seine Härte. Die örtliche Wasserhärte, der Verbrauch und Ihre Installation bilden die Grundlage für die Auslegung.'},
        {name:'Austauschharz', text:'Die kleinen Harzkügelchen binden Calcium- und Magnesiumionen. Dafür gelangen Natriumionen ins Wasser. Das Wasser wird weicher; es handelt sich nicht um eine vollständige Entsalzung oder einen Schmutzfilter.'},
        {name:'Steuerventil', text:'Das Ventil lenkt die Wasserwege und steuert die Regeneration. Eine passend eingestellte Verschneidung kann unbehandeltes Wasser beimischen, damit die geplante Resthärte erreicht wird. Diese zusätzlichen Leitungen sind hier nicht dargestellt.'},
        {name:'Salz & Regeneration', text:'Regeneriersalz bildet mit Wasser eine Sole. Diese löst die aufgenommenen Härtebildner vom Harz; anschließend wird gespült. Regenerat und Spülwasser gehen zum Abwasser, nicht in die Trinkwasserleitung. Salz nachfüllen und Wartung gehören zum Betrieb.'}
      ]
    },
    water: {
      scene: 'Warmwasserspeicher · indirekte Beheizung', title: 'Warmwasser. Sauber getrennt.',
      summary: 'Eine Heizwendel erwärmt das Trinkwasser im Speicher. Die Armatur mischt warmes und kaltes Trinkwasser zur gewünschten Temperatur. Heizwasser und Trinkwasser bleiben getrennt.',
      note: 'Indirekt beheizter Speicher als Funktionsschema. Hygiene, Temperaturniveau und Sicherheitsarmaturen gehören in die Fachplanung; das Modell zeigt nicht alle erforderlichen Bauteile.',
      alt: 'Drehbares 3D-Schnittmodell eines Trinkwarmwasserspeichers mit separater kupferfarbener Heizwendel. Kaltes Trinkwasser tritt unten ein, warmes tritt oben aus und gelangt zur Mischarmatur. Heizwasser und Trinkwasser vermischen sich nicht.',
      components: [
        { name: 'Heizwendel', text: 'Durch die Heizwendel fließt Wasser aus der Heizungsanlage. Die Rohrwand überträgt dessen Wärme auf das Trinkwasser im Speicher. Die beiden Wasserarten bleiben vollständig getrennt.' },
        { name: 'Kaltwasserzulauf', text: 'Kaltes Trinkwasser gelangt im unteren Bereich in den Speicher. Wird Warmwasser entnommen, strömt neues Trinkwasser nach. Die notwendigen Sicherungsarmaturen sind im Modell nicht dargestellt.' },
        { name: 'Warmwasserauslass', text: 'Warmes Trinkwasser wird im oberen Bereich entnommen und zu den Zapfstellen geführt. Speichervolumen, Temperaturen und Leitungssystem müssen passend zum Bedarf und hygienegerecht geplant werden.' },
        { name: 'Mischarmatur', text: 'Die Armatur mischt warmes und kaltes Trinkwasser. An Waschbecken oder Dusche lässt sich damit die gewünschte Temperatur einstellen. Der Heizwasserkreis ist nicht an die Armatur angeschlossen.' }
      ]
    }
  };
  const C = { shell:'#edf1ee', steel:'#8296a0', deep:'#183f57', cyan:'#299aae', copper:'#c48052', warm:'#c96843', brass:'#cba065', silver:'#b6c9ce', tile:'#d9c6ae', screed:'#b7bcb5', insulation:'#e4d8b5', concrete:'#91a4aa' };
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const add = (a,b) => a.map((n,i)=>n+b[i]);
  const sub = (a,b) => a.map((n,i)=>n-b[i]);
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const norm = a => {const m=Math.hypot(...a)||1;return a.map(n=>n/m);};
  const mix = (a,b,t) => a.map((n,i)=>n+(b[i]-n)*t);
  const rgb = hex => [parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)];
  const colors = new Map();
  function color(hex) {if(!colors.has(hex))colors.set(hex,rgb(hex));return colors.get(hex);}
  function shade(hex, amount) {return 'rgb('+color(hex).map(n=>Math.round(clamp(n*amount,0,255))).join(',')+')';}
  function roundedRect(ctx,x,y,w,h,r) {ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
  function Mesh() {this.faces=[];this.flows=[];this.anchors=[];this.fan=null;this.bounds=[Infinity,-Infinity,Infinity,-Infinity,Infinity,-Infinity];}
  Mesh.prototype.face=function(points,fill,alpha=1,edge=.11){points.forEach(p=>{for(let i=0;i<3;i++){this.bounds[i*2]=Math.min(this.bounds[i*2],p[i]);this.bounds[i*2+1]=Math.max(this.bounds[i*2+1],p[i]);}});const n=norm(cross(sub(points[1],points[0]),sub(points[2],points[0])));this.faces.push({points,n,fill,alpha,edge});};
  Mesh.prototype.box=function(p,w,h,d,fill,alpha=1){const [x,y,z]=p,X=w/2,Y=h/2,Z=d/2,v=[[x-X,y-Y,z-Z],[x+X,y-Y,z-Z],[x+X,y+Y,z-Z],[x-X,y+Y,z-Z],[x-X,y-Y,z+Z],[x+X,y-Y,z+Z],[x+X,y+Y,z+Z],[x-X,y+Y,z+Z]];[[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]].forEach(f=>this.face(f.map(i=>v[i]),fill,alpha));};
  Mesh.prototype.cylinder=function(a,b,r,fill,segments=14,alpha=1,caps=true){const axis=norm(sub(b,a)),u=norm(cross(axis,Math.abs(axis[1])>.9?[1,0,0]:[0,1,0])),v=cross(axis,u);const ring=p=>Array.from({length:segments},(_,i)=>add(p,u.map((n,j)=>r*(n*Math.cos(i*TAU/segments)+v[j]*Math.sin(i*TAU/segments)))));const A=ring(a),B=ring(b);for(let i=0;i<segments;i++){const j=(i+1)%segments;this.face([A[i],A[j],B[j],B[i]],fill,alpha,0);}if(caps){this.face(A.slice().reverse(),fill,alpha,0);this.face(B,fill,alpha,0);}};
  Mesh.prototype.tube=function(points,r,fill,alpha=1){for(let i=1;i<points.length;i++)this.cylinder(points[i-1],points[i],r,fill,7,alpha,false);};
  Mesh.prototype.flow=function(points,fill,count=5,phase=0){this.flows.push({points,fill,count,phase,lengths:points.slice(1).map((p,i)=>Math.hypot(...sub(p,points[i])))});};
  Mesh.prototype.ring=function(center,inner,outer,fill,segments=28){for(let i=0;i<segments;i++){const a=i*TAU/segments,b=(i+1)*TAU/segments;this.face([[center[0]+Math.cos(a)*inner,center[1]+Math.sin(a)*inner,center[2]],[center[0]+Math.cos(a)*outer,center[1]+Math.sin(a)*outer,center[2]],[center[0]+Math.cos(b)*outer,center[1]+Math.sin(b)*outer,center[2]],[center[0]+Math.cos(b)*inner,center[1]+Math.sin(b)*inner,center[2]]],fill,1,.05);}};
  function pipe(mesh,points,fill,r=.045,particles=0){mesh.tube(points,r,fill);if(particles)mesh.flow(points,fill,particles);}
  function buildHeat(e){
    const m=new Mesh(),front=.67+e*.9;
    // Open casing: the front, side and top move away in the exploded view.
    m.box([-1.7,-1.12,-.1],2.05,.13,1.18,C.deep);m.box([-1.7,.05,-.56],2.05,2.45,.08,C.shell);
    m.box([-2.72-e*.25,.05,-.05],.09,2.45,1.12,C.shell);m.box([-1.7,1.3+e*.22,-.06],2.12,.09,1.2,C.shell);
    m.box([-2.25,-1.29,0],.28,.23,.65,C.deep);m.box([-1.12,-1.29,0],.28,.23,.65,C.deep);
    // Heat exchanger: individual fins and refrigerant headers.
    m.box([-1.72,.04,-.18],1.45,1.87,.3,C.steel);
    for(let i=0;i<22;i++)m.box([-2.4+i*.065,.04,.005],.025,1.8,.095,i%2?C.silver:'#a8b9bc');
    pipe(m,[[-2.46,-.87,.05],[-2.46,.97,.05]],C.copper,.055);
    pipe(m,[[-.97,-.87,.05],[-.97,.97,.05]],C.copper,.055);
    // Fan frame and grille, separated from the heat exchanger.
    const fc=[-1.73,.12,front];m.ring(fc,.625,.682,C.deep,36);m.ring([fc[0],fc[1],front+.03],.557,.575,C.silver,36);
    for(let i=0;i<5;i++){const a=i*Math.PI/5;pipe(m,[[fc[0]-.63*Math.cos(a),fc[1]-.63*Math.sin(a),front+.045],[fc[0]+.63*Math.cos(a),fc[1]+.63*Math.sin(a),front+.045]],C.silver,.008);}
    m.cylinder([fc[0],fc[1],front+.055],[fc[0],fc[1],front+.13],.12,C.deep,16);m.fan={center:fc};
    // Electrically driven hermetic compressor.
    m.cylinder([.05,-1.05,.12],[.05,-.32,.12],.26,C.deep,20);m.cylinder([.05,-1.1,.12],[.05,-1.02,.12],.3,C.steel,18);m.box([.21,-.53,.36],.18,.2,.12,C.silver);
    // Refrigerant / heating-water plate heat exchanger.
    m.box([1.36,.49,.1],.53,1.11,.63,C.silver);
    for(let i=0;i<9;i++)m.box([1.36,.06+i*.103,.445],.48,.026,.023,C.steel);
    m.box([.8,-.91,.28],.3,.23,.25,C.brass);m.cylinder([.8,-.84,.28],[.8,-.53,.28],.09,C.deep,12);
    const suction=[[-.97,-.43,.14],[-.58,-.43,.14],[-.58,-.78,.14],[-.18,-.78,.14]];
    const hot=[[.11,-.32,.13],[.11,1.16,.13],[1.35,1.16,.13],[1.35,1.02,.13]];
    const liquid=[[1.35,-.1,.13],[1.35,-.91,.13],[.94,-.91,.28]];
    const cold=[[.65,-.91,.28],[-1.73,-.91,.28],[-1.73,-.81,.13]];
    pipe(m,suction,C.cyan,.05,4);pipe(m,hot,C.warm,.05,7);pipe(m,liquid,C.copper,.05,4);pipe(m,cold,C.cyan,.05,6);
    // A separate heating-water circuit: no connection to the refrigerant tube.
    const supply=[[1.65,.82,.37],[2.12,.82,.37],[2.12,.6,.37],[2.58,.6,.37]];
    const ret=[[2.58,-.26,.37],[2.12,-.26,.37],[2.12,.15,.37],[1.65,.15,.37]];
    pipe(m,supply,C.warm,.064,4);pipe(m,ret,C.cyan,.064,4);
    for(let i=0;i<7;i++)m.box([2.67,-.0,-.11+i*.13],.16,.9,.08,C.shell);
    pipe(m,[[2.67,.45,-.15],[2.67,.45,.71]],C.silver,.07);pipe(m,[[2.67,-.45,-.15],[2.67,-.45,.71]],C.silver,.07);
    m.anchors=[[-1.72,.94,.16],[.04,-.52,.45],[1.38,.71,.48],[.8,-.74,.46]];
    return m;
  }
  function floorPath(){
    const p=[],xmin=-1.85,xmax=1.3,z0=-.8,step=.3;
    for(let row=0;row<6;row++){
      const z=z0+row*step,start=row%2?xmin:xmax,end=row%2?xmax:xmin;
      if(row===0)p.push([start,0,z]);
      p.push([end,0,z]);
      if(row<5){const sign=row%2?1:-1;for(let k=1;k<=10;k++){const a=-Math.PI/2+k*Math.PI/10;p.push([end+sign*Math.cos(a)*step/2,0,z+step/2+Math.sin(a)*step/2]);}}
    }
    return p;
  }
  function buildFloor(e){
    const m=new Mesh(),baseY=-.85,insY=-.56+e*.25,tubeY=-.29+e*.7,screedY=-.13+e*1.05,tileY=.17+e*1.5;
    m.box([-.3,baseY,0],3.8,.28,2.25,C.concrete);
    m.box([-.3,insY,0],3.8,.26,2.25,C.insulation);
    for(let i=0;i<11;i++)m.box([-2.08+i*.35,insY,.0],.014,.262,2.25,'#d1c5a3');
    // Deliberate cutaway: the front-right area exposes the pipes.
    m.box([-.9,screedY,-.48],2.6,.37,1.3,C.screed);m.box([-1.56,screedY,.65],1.28,.37,.95,C.screed);
    // Fine mineral texture expressed as geometry, without images.
    for(let i=0;i<13;i++){const x=-2.08+(i*37%110)/100*2.4,z=-1.02+(i*29%80)/100; m.box([x,screedY+.19,z],.025,.006,.022,'#99a59e');}
    // Tile pieces: a few joints make the layer readable when lifted.
    for(let ix=0;ix<4;ix++)for(let iz=0;iz<3;iz++){if(ix>1&&iz>1)continue;const x=-1.77+ix*.75,z=-.77+iz*.73;m.box([x,tileY,z],.734,.085,.712,(ix+iz)%2?'#d8c7af':'#e2d3bd');}
    const loop=floorPath().map(p=>[p[0],tubeY,p[2]]);
    for(let i=1;i<loop.length;i++){const t=i/loop.length;const c=t<.38?C.warm:t<.72?C.copper:C.cyan;m.tube([loop[i-1],loop[i]],.045,c);}
    m.flow(loop,C.warm,12);
    // One illustrated loop, plus additional capped manifold connections.
    const x=2.18,railTop=.55,railLow=.23;
    pipe(m,[[x,railTop,-.85],[x,railTop,.85]],C.copper,.08);pipe(m,[[x,railLow,-.85],[x,railLow,.85]],C.cyan,.075);
    m.box([x,.2,-1],.38,1.05,.05,C.shell);m.box([x,.2,1],.38,1.05,.05,C.shell);
    for(let i=0;i<4;i++){const z=-.64+i*.42;m.cylinder([x,railTop+.07,z],[x,railTop+.32,z],.05,C.silver,10);m.cylinder([x,railTop+.32,z],[x,railTop+.4,z],.055,C.warm,10);m.cylinder([x,railLow-.13,z],[x,railLow-.06,z],.065,C.deep,10);}
    pipe(m,[[x,railTop,-.8],[1.66,railTop,-.8],[1.66,tubeY,-.8],[1.3,tubeY,-.8]],C.warm,.045,4);
    pipe(m,[[1.3,tubeY,.7],[1.7,tubeY,.7],[1.7,railLow,.7],[x,railLow,.7]],C.cyan,.045,4);
    m.anchors=[[-.38,tileY+.07,-.4],[-1.35,screedY+.2,.48],[.55,tubeY+.04,.11],[-1.04,insY,.98],[-1.76,baseY,.98],[x,.54,.45]];
    return m;
  }
  function buildWater(e){
    const m=new Mesh(),cx=-.85;
    // Rear half of a storage cylinder: open at the viewer-facing side.
    const r=.85,segments=30;for(let i=0;i<segments;i++){const a=i*TAU/segments,b=(i+1)*TAU/segments;if(Math.sin((a+b)/2)>.45)continue;const A=[cx+r*Math.cos(a),-1.23,r*Math.sin(a)],B=[cx+r*Math.cos(b),-1.23,r*Math.sin(b)];m.face([A,B,[B[0],1.4,B[2]],[A[0],1.4,A[2]]],C.shell,1,.09);}
    m.cylinder([cx,-1.33,0],[cx,-1.23,0],r,C.deep,30);m.cylinder([cx,1.4,0],[cx,1.46,0],r,C.shell,30);
    // Water volume is translucent; no literal temperature gradient is implied.
    m.cylinder([cx,-1.21,0],[cx,1.37,0],.73,'#76b9c7',22,.19,false);
    // Side insulation panel slides out in the exploded view.
    if(e>.02){m.box([cx+1.04+e*.45,.08,.1],.11,2.48,.75,C.insulation);m.box([cx+1.13+e*.45,.08,.1],.07,2.53,.8,C.shell);}
    const coil=[],coilZ=e*.35;for(let i=0;i<=125;i++){const a=i/125*TAU*5;coil.push([cx+.53*Math.cos(a),.82-i/125*1.65,.53*Math.sin(a)+coilZ]);}
    m.tube(coil,.042,C.copper);m.flow(coil,C.warm,10);
    const coilIn=[[-2.33,.87,.26],[-1.92,.87,.26],[-1.92,.82,coilZ],[cx+.53,.82,coilZ]];
    const coilOut=[[cx+.53,-.83,coilZ],[-1.9,-.83,coilZ],[-1.9,-.81,.26],[-2.33,-.81,.26]];
    pipe(m,coilIn,C.warm,.045,5);pipe(m,coilOut,C.cyan,.045,5);
    // The cold drinking-water connection is entirely distinct from the coil.
    const potableCold=[[2.37,-1.14,.16],[.46,-1.14,.16],[.46,-1.02,.16],[cx,-1.02,.16]];
    pipe(m,potableCold,C.cyan,.05,7);
    const potableHot=[[cx,1.44,.1],[cx,1.76,.1],[1.55,1.76,.1],[1.55,.05,.1],[1.99,.05,.1]];
    pipe(m,potableHot,C.warm,.05,10);
    const tapCold=[[2.37,-1.14,.16],[2.65,-1.14,.16],[2.65,.05,.16],[2.17,.05,.16]];
    pipe(m,tapCold,C.cyan,.05,6);
    // Chrome mixed-water tap and a simple washbasin.
    m.cylinder([2.1,-.06,.13],[2.1,.48,.13],.11,C.silver,18);
    const spout=[];for(let i=0;i<=15;i++){const a=Math.PI-i/15*Math.PI;spout.push([2.43+.33*Math.cos(a),.48+.33*Math.sin(a),.13]);}
    m.tube(spout,.073,C.silver);pipe(m,[[2.76,.48,.13],[2.76,.32,.13]],C.silver,.073);
    m.box([2.07,.39,.28],.25,.065,.13,C.deep);m.cylinder([2.1,-.13,.13],[2.1,-.07,.13],.18,C.silver,16);
    // A pale schematic mixed-water stream and open basin geometry.
    pipe(m,[[2.76,.32,.13],[2.76,-.39,.13]],'#78bac1',.028,4);
    m.box([2.47,-.61,.13],1.19,.1,1.12,C.shell);m.box([1.89,-.43,.13],.07,.37,1.12,C.shell);m.box([3.05,-.43,.13],.07,.37,1.12,C.shell);m.box([2.47,-.43,-.4],1.19,.37,.07,C.shell);m.box([2.47,-.43,.66],1.19,.37,.07,C.shell);
    m.cylinder([2.56,-.57,.13],[2.56,-.53,.13],.1,C.silver,16);
    m.anchors=[[cx+.51,.23,.5+coilZ],[cx,-1.03,.25],[cx,1.51,.17],[2.12,.55,.22]];
    return m;
  }
  function buildBalance(e){
    const m=new Mesh(),adjusted=e>.5;
    m.box([0,-1.31,0],6.4,.14,2.05,'#d8e3e5');
    // Heat source and circulator. The diagram omits expansion vessel and safety devices.
    m.box([-2.63,.07,-.05],.67,1.98,.52,C.shell);m.box([-2.63,.71,.23],.4,.18,.04,C.deep);
    m.cylinder([-2.49,-.72,.06],[-2.49,-.72,.47],.18,C.deep,18);m.cylinder([-2.49,-.72,.47],[-2.49,-.72,.53],.12,C.silver,16);
    const supply=[[-2.49,.36,.12],[-2.22,.36,.12],[-2.22,-.63,.12],[2.58,-.63,.12]];
    const ret=[[2.58,-1.04,.45],[-2.6,-1.04,.45],[-2.6,-.88,.12]];
    pipe(m,supply,C.warm,.045,8);pipe(m,ret,C.cyan,.045,8);
    const centers=[-1.0,.65,2.23];
    centers.forEach((x,i)=>{
      m.box([x,.15,-.19],1.22,1.93,.07,'#e7eeed');
      const radiatorColor=adjusted?['#dbba9e','#e0c1a5','#d9b697'][i]:['#d7a480','#d1c8b7','#a9c7cb'][i];
      for(let n=0;n<7;n++)m.box([x-.46+n*.154,.16,.17],.13,.91,.23,radiatorColor);
      pipe(m,[[x-.48,.63,.16],[x+.48,.63,.16]],C.silver,.061);pipe(m,[[x-.48,-.31,.16],[x+.48,-.31,.16]],C.silver,.061);
      const branchSupply=[[x-.43,-.63,.12],[x-.43,.63,.12],[x-.34,.63,.17]];
      const branchReturn=[[x+.43,-.31,.17],[x+.43,-1.04,.45]];
      pipe(m,branchSupply,C.warm,.035);pipe(m,branchReturn,C.cyan,.035);
      const through=branchSupply.concat([[x+.34,.63,.17],[x+.34,-.31,.17]],branchReturn);
      m.flow(through,C.warm,adjusted?[5,6,4][i]:[9,5,2][i]);m.flows[m.flows.length-1].speed=adjusted?[.1,.11,.09][i]:[.17,.1,.045][i];
      m.cylinder([x-.46,.63,.17],[x-.46,.63,.34],.084,C.brass,12);m.cylinder([x-.46,.63,.34],[x-.46,.63,.47],.085,C.shell,12);
      const knob=adjusted?[.24,.15,.09][i]:.2;m.box([x-.46,.63,.5],knob,.033,.035,C.deep);
    });
    m.anchors=[[-2.49,-.7,.55],[-1.46,.64,.5],[2.22,.29,.34],[.2,-.65,.26]];
    return m;
  }
  function exchanger(m,cx,cy,cz,rx,ry,turns){
    const points=[];for(let i=0;i<=turns*28;i++){const a=i/28*TAU;points.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry,cz+i/(turns*28)*.72]);}m.tube(points,.05,C.silver);return points;
  }
  function burnerFlame(m,x,y,z){
    for(let n=0;n<5;n++){const dx=(n-2)*.09,h=n===2?.34:.23;m.face([[x+dx-.055,y,z],[x+dx+.05,y,z],[x+dx+.018,y+h,z-.025]],n%2?'#d89948':'#4dacc1',.95,0);}
  }
  function buildGas(e){
    const m=new Mesh(),cx=-.65;
    m.box([cx,-1.26,0],2,.13,1.1,C.deep);m.box([cx,.04,-.54],2,2.56,.09,C.shell);
    m.box([cx-1-e*.25,.04,0],.09,2.56,1.1,C.shell);m.box([cx+1+e*.38,.04,0],.09,2.56,1.1,C.shell);
    m.box([cx,1.35+e*.32,0],2.07,.09,1.15,C.shell);
    // Open metal combustion chamber; closed heating-water coil stays separate.
    m.cylinder([cx,.47,-.32],[cx,.47,.04],.63,C.deep,28,1,false);
    const coil=exchanger(m,cx,.47,-.32,.65,.62,7);m.flow(coil,C.warm,9);
    m.box([cx,.11,.58+e*.45],.56,.1,.34,C.steel);burnerFlame(m,cx,.17,.61+e*.45);
    pipe(m,[[-2.6,-1.25,.35],[-2.6,-.59,.35],[cx,-.59,.35],[cx,.13,.35]],'#c6a44e',.048,5);
    m.box([cx,-.58,.35],.27,.28,.2,C.brass);
    m.cylinder([cx+.61,-.68,.29],[cx+.61,-.68,.65],.22,C.deep,18);m.cylinder([cx+.61,-.68,.65],[cx+.61,-.68,.7],.14,C.silver,18);
    pipe(m,[[cx+.65,.47,.4],[1.17,.47,.4],[1.17,.56,.12],[1.65,.56,.12]],C.warm,.055,6);
    pipe(m,[[2.58,-.56,.12],[1.3,-.56,.12],[1.3,-1.07,.2],[cx+.6,-1.07,.2],[cx+.6,-.7,.3],[cx+.65,.47,-.32]],C.cyan,.055,7);
    for(let i=0;i<8;i++)m.box([1.65+i*.13,.0,.13],.11,1.14,.26,C.shell);
    pipe(m,[[1.65,.56,.12],[2.58,.56,.12]],C.silver,.06);pipe(m,[[1.65,-.56,.12],[2.58,-.56,.12]],C.silver,.06);
    pipe(m,[[cx,.89,-.33],[cx,1.94,-.33],[cx+.7,1.94,-.33]],C.steel,.145);
    pipe(m,[[cx-.25,-.03,-.1],[cx-.25,-.99,-.1],[cx-.52,-.99,.35],[cx-.52,-1.43,.35]],'#96b4bd',.034,3);
    m.box([cx,-1.03,.61+e*.5],.76,.21,.04,C.deep);m.box([cx-.17,-1.03,.64+e*.5],.24,.07,.015,'#80b7b4');
    m.anchors=[[cx,.27,.77+e*.45],[cx-.45,.69,.53],[cx+.66,-.63,.74],[cx+.14,1.72,-.18]];return m;
  }
  function buildOil(e){
    const m=new Mesh(),cx=.15;
    m.box([-2.04,-.19,-.03],1.03,1.84,.99,'#9bb0b2');m.box([-2.04,.79,-.03],1.06,.14,1.03,C.silver);
    m.box([-2.04,-1.19,-.03],1.22,.15,1.18,C.deep);m.cylinder([-2.02,.85,-.03],[-2.02,1.12,-.03],.12,C.deep,14);
    for(const z of [-.52,.46])m.box([-2.04,-.2,z],.07,1.85,.035,C.steel);
    m.box([cx,-1.29,0],1.82,.17,1.45,C.deep);m.box([cx,-.01,-.69],1.75,2.46,.08,C.shell);
    m.box([cx-.89-e*.22,-.01,0],.09,2.46,1.41,C.shell);m.box([cx+.89+e*.24,-.01,0],.09,2.46,1.41,C.shell);
    m.box([cx,1.25+e*.28,0],1.87,.09,1.48,C.shell);
    m.cylinder([cx,.19,-.54],[cx,.19,.55],.55,C.deep,26,1,false);exchanger(m,cx,.22,-.53,.61,.62,8);
    m.cylinder([cx,-.48,.44],[cx,-.48,1.07+e*.55],.32,C.steel,22);m.box([cx,-.48,1.13+e*.55],.54,.45,.16,C.deep);
    burnerFlame(m,cx,-.19,.62);m.cylinder([cx+.3,-.45,.87],[cx+.3,-.45,1.12+e*.4],.12,C.brass,12);
    pipe(m,[[-2.05,.73,.15],[-1.55,.73,.15],[-1.55,-.73,.48],[cx-.42,-.73,.48],[cx-.42,-.48,.96],[cx,-.48,.96]],C.copper,.039,6);
    m.cylinder([-1.54,-.24,.48],[-1.54,-.53,.48],.12,C.brass,12);
    pipe(m,[[cx+.59,.58,.2],[1.53,.58,.2],[1.53,.97,.2],[2.75,.97,.2]],C.warm,.057,7);
    pipe(m,[[2.75,-.58,.2],[1.72,-.58,.2],[1.72,-1.07,.2],[cx+.57,-1.07,.2],[cx+.57,-.24,.2]],C.cyan,.057,7);
    m.cylinder([1.72,-.58,.2],[1.72,-.58,.52],.19,C.deep,16);m.cylinder([1.72,-.58,.52],[1.72,-.58,.58],.12,C.silver,14);
    pipe(m,[[cx,.89,-.44],[cx,1.81,-.44],[cx+.9,1.81,-.44]],C.steel,.15);
    pipe(m,[[cx-.25,-.5,-.38],[cx-.25,-1.4,-.38],[cx-.61,-1.4,.28]],'#96b4bd',.035,3);
    m.box([cx,.98,.72+e*.4],.74,.22,.045,C.deep);m.box([cx-.14,.98,.75+e*.4],.24,.08,.025,'#80b7b4');
    m.anchors=[[-2.04,.16,.57],[cx,-.44,1.3+e*.55],[cx-.4,.65,.65],[1.75,.92,.28]];return m;
  }
  function buildSoftener(e){
    const m=new Mesh(),regen=e>.5,cx=-.64,green='#378e88';
    m.box([.1,-1.29,0],4.68,.11,1.66,'#dae5e4');
    // Cutaway pressure vessel: open front exposes resin and a central riser.
    m.cylinder([cx,-1.19,0],[cx,-1.04,0],.58,C.deep,24);
    for(let i=0;i<20;i++){const a=i*TAU/32+2.74,b=(i+1)*TAU/32+2.74,r=.56;m.face([[cx+Math.cos(a)*r,-1.03,Math.sin(a)*r],[cx+Math.cos(b)*r,-1.03,Math.sin(b)*r],[cx+Math.cos(b)*r,1.02,Math.sin(b)*r],[cx+Math.cos(a)*r,1.02,Math.sin(a)*r]],'#adcecf',1,.07);}
    m.cylinder([cx,.97,0],[cx,1.1,0],.55,C.shell,24);
    m.cylinder([cx,-1.04,0],[cx,.33,0],.41,regen?'#bd996d':'#c59859',20);
    for(let row=0;row<6;row++)for(let col=0;col<6;col++){const x=cx-.34+col*.133,y=-.91+row*.22;m.cylinder([x,y,.335],[x,y+.07,.39],.06,(col+row)%2?'#e0b87a':'#c89a60',6);}
    pipe(m,[[cx,-.97,.02],[cx,1.24,.02]],green,.065);
    m.box([cx,1.27,0],.94,.28,.6,C.deep);m.box([cx,1.28,.315],.47,.13,.025,'#7daaaa');
    const raw=[[-2.75,.92,.15],[-1.38,.92,.15],[-1.38,1.31,.1],[cx-.34,1.31,.1],[cx-.34,-.96,.19]];
    const softened=[[cx,-.96,.04],[cx,1.32,.04],[.38,1.32,.04],[.38,.94,.04],[2.77,.94,.04]];
    pipe(m,raw,C.cyan,.065,regen?0:7);pipe(m,softened,green,.065,regen?0:8);
    // Separate brine reservoir with salt pellets, not a second drinking-water tank.
    m.box([1.56,-1.13,.04],1.06,.16,1.01,C.shell);m.box([1.03,-.51,.04],.07,1.13,1.01,C.shell);m.box([2.09,-.51,.04],.07,1.13,1.01,C.shell);m.box([1.56,-.51,-.46],1.06,1.13,.07,C.shell);
    m.box([1.56,-.9,.04],.94,.19,.86,'#b9cecd');m.box([1.56,-.7,.52],1.07,.73,.05,'#cfdedb');
    for(let n=0;n<25;n++){const x=1.2+(n%5)*.17,z=-.3+Math.floor(n/5)*.16;m.box([x,-.48+(n%3)*.035,z],.145,.1,.12,n%2?'#fffdf6':'#e9e8de');}
    m.box([1.56,.15+e*.17,-.36-e*.35],1.16,.09,1.08,C.deep);
    const brine=[[1.84,-.96,-.25],[1.84,.36,-.25],[.04,.36,-.25],[.04,1.32,-.25],[cx-.3,1.32,-.25],[cx-.3,-.93,-.25]];
    pipe(m,brine,'#b38a54',.04,regen?7:0);
    const drain=[[cx,-.94,.04],[cx,1.36,.04],[cx+.3,1.36,-.31],[.55,1.36,-.31],[.55,-1.04,-.31],[2.6,-1.04,-.31],[2.6,-1.36,-.31]];
    pipe(m,drain,C.steel,.036,regen?8:0);m.box([2.6,-1.23,-.31],.44,.12,.33,C.deep);
    m.anchors=[[-1.92,.94,.2],[cx-.18,-.19,.49],[cx,1.38,.35],[1.6,-.39,.6]];return m;
  }
  const BUILD={heat:buildHeat,floor:buildFloor,water:buildWater,balance:buildBalance,gas:buildGas,oil:buildOil,softener:buildSoftener};
  function Studio(root){
    if(root.dataset.techReady)return;root.dataset.techReady='true';
    this.root=root;this.cleanup=[];this.canvas=root.querySelector('[data-tech-canvas]');this.view=root.querySelector('[data-tech-view]');
    this.ctx=null;try{if(this.canvas)this.ctx=this.canvas.getContext('2d',{alpha:false});}catch(_){try{this.ctx=this.canvas.getContext('2d');}catch(__){}}
    if(!this.ctx){root.dataset.techUnavailable='true';return;}
    this.mode='heat';this.selected=0;this.yaw=-.44;this.pitch=.16;this.width=0;this.height=0;this.time=0;this.last=0;this.request=0;this.visible=false;this.forceDraw=false;this.drawn=false;this.resizeRetries=0;this.drag=null;this.explode=0;this.targetExplode=0;this.motion=false;this.hotspots=[];this.destroyed=false;this.cleanup=[];this.media=typeof window.matchMedia==='function'?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
    this.mesh=buildHeat(0);this.bind();this.updateText();this.resize(true);
    // Draw one static frame independently of observer delivery. Only continuous motion uses visibility.
    if(typeof window.IntersectionObserver==='function'){try{this.intersection=new window.IntersectionObserver(entries=>{this.visible=entries.some(e=>e.isIntersecting);if(this.visible)this.schedule();else if(this.drawn)this.cancel();},{rootMargin:'90px'});this.intersection.observe(this.view);}catch(_){this.visible=true;this.schedule(true);}}else{this.visible=true;this.schedule(true);}
    if(typeof window.ResizeObserver==='function'){try{this.resizer=new window.ResizeObserver(()=>this.resize(true));this.resizer.observe(this.view);}catch(_){this.listen(window,'resize',()=>this.resize(true));}}else this.listen(window,'resize',()=>this.resize(true));
    this.listen(window,'pageshow',()=>this.resize(true));this.listen(window,'orientationchange',()=>this.resize(true));
    this.listen(document,'visibilitychange',()=>{if(document.hidden)this.cancel();else this.resize(true);});
  }
  Studio.prototype.listen=function(target,event,fn,options){target.addEventListener(event,fn,options);this.cleanup.push(()=>target.removeEventListener(event,fn,options));};
  Studio.prototype.bind=function(){
    const self=this;
    const picker=this.root.querySelector('[data-tech-select]');if(picker)this.listen(picker,'change',()=>self.setMode(picker.value));
    this.listen(this.root,'click',function(event){const tab=event.target.closest('[data-tech-tab]'),component=event.target.closest('[data-tech-component]'),action=event.target.closest('[data-tech-action]');if(tab){self.setMode(tab.dataset.techTab);return;}if(component){self.select(+component.dataset.techComponent);return;}if(action)self.action(action.dataset.techAction);});
    this.listen(this.root.querySelector('[role=tablist]'),'keydown',function(event){if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;const tabs=Array.from(self.root.querySelectorAll('[data-tech-tab]')),current=tabs.findIndex(t=>t.dataset.techTab===self.mode),next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(current+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length;event.preventDefault();self.setMode(tabs[next].dataset.techTab);tabs[next].focus();});
    this.listen(this.view,'keydown',function(event){if(event.target!==self.view)return;self.visible=true;const keys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'];if(!keys.includes(event.key))return;event.preventDefault();if(event.key==='Home')self.reset();else{if(event.key==='ArrowLeft')self.yaw-=.13;if(event.key==='ArrowRight')self.yaw+=.13;if(event.key==='ArrowUp')self.pitch=clamp(self.pitch+.09,-.34,.68);if(event.key==='ArrowDown')self.pitch=clamp(self.pitch-.09,-.34,.68);}self.schedule(true);});
    this.listen(this.canvas,'pointerdown',function(event){if(event.button!==0)return;self.visible=true;self.drag={x:event.clientX,y:event.clientY,lastX:event.clientX,lastY:event.clientY,moved:false};if(typeof self.canvas.setPointerCapture==='function')try{self.canvas.setPointerCapture(event.pointerId);}catch(_){};});
    this.listen(this.canvas,'pointermove',function(event){if(!self.drag)return;const d=self.drag;if(Math.hypot(event.clientX-d.x,event.clientY-d.y)>6)d.moved=true;if(d.moved){self.yaw+=(event.clientX-d.lastX)*.007;self.pitch=clamp(self.pitch+(event.clientY-d.lastY)*.004,-.34,.68);self.view.classList.add('is-dragging');const hint=self.root.querySelector('[data-tech-hint]');if(hint)hint.style.opacity='.35';self.schedule(true);}d.lastX=event.clientX;d.lastY=event.clientY;});
    this.listen(this.canvas,'pointerup',function(event){if(!self.drag)return;if(!self.drag.moved){const rect=self.canvas.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;let closest=null;self.hotspots.forEach(h=>{const dist=Math.hypot(x-h.x,y-h.y);if(dist<25&&(!closest||dist<closest.dist))closest={index:h.index,dist};});if(closest)self.select(closest.index);}self.drag=null;self.view.classList.remove('is-dragging');});
    this.listen(this.canvas,'pointercancel',()=>{self.drag=null;self.view.classList.remove('is-dragging');});
  };
  Studio.prototype.resize=function(force=false){if(this.destroyed)return;const r=this.view.getBoundingClientRect();if(!r.width||!r.height){if(this.resizeRetries++<20)requestAnimationFrame(()=>this.resize(true));return;}this.resizeRetries=0;this.width=r.width;this.height=r.height;const dpr=Math.min(window.devicePixelRatio||1,2);this.canvas.width=Math.round(r.width*dpr);this.canvas.height=Math.round(r.height*dpr);this.ctx.setTransform(dpr,0,0,dpr,0,0);this.schedule(force);};
  Studio.prototype.reset=function(){this.yaw=this.mode==='floor'?-.5:-.44;this.pitch=this.mode==='floor'?.48:.16;};
  Studio.prototype.setMode=function(mode){if(!THEMES[mode])return;this.visible=true;this.mode=mode;this.selected=0;this.explode=this.targetExplode=0;this.mesh=BUILD[mode](0);this.reset();this.updateText();this.schedule(true);};
  Studio.prototype.select=function(index){if(!THEMES[this.mode].components[index])return;this.visible=true;this.selected=index;if(this.mode==='floor'&&index>0&&index<5&&!this.targetExplode){this.targetExplode=1;if(this.media.matches){this.explode=1;this.mesh=buildFloor(1);}this.updateControls();}this.updateComponent();this.schedule(true);};
  Studio.prototype.action=function(action){this.visible=true;if(action==='left')this.yaw-=.23;if(action==='right')this.yaw+=.23;if(action==='reset')this.reset();if(action==='explode'){this.targetExplode=this.targetExplode?0:1;if(this.media.matches){this.explode=this.targetExplode;this.mesh=BUILD[this.mode](this.explode);}this.updateControls();}if(action==='animate'){this.motion=!this.motion;this.updateControls();}this.schedule(true);};
  Studio.prototype.updateControls=function(){const explode=this.root.querySelector('[data-tech-action=explode]'),animate=this.root.querySelector('[data-tech-action=animate]');explode.setAttribute('aria-pressed',String(!!this.targetExplode));explode.innerHTML='<span aria-hidden="true">⊞</span> '+(this.mode==='balance'?(this.targetExplode?'Vorher zeigen':'Abgleich zeigen'):this.mode==='softener'?(this.targetExplode?'Betrieb zeigen':'Regeneration zeigen'):(this.targetExplode?'Zusammenbauen':'Bauteile trennen'));animate.setAttribute('aria-pressed',String(this.motion));animate.innerHTML='<span aria-hidden="true">'+(this.motion?'Ⅱ':'▷')+'</span> '+(this.motion?'Fluss pausieren':'Fluss starten');};
  Studio.prototype.updateText=function(){const t=THEMES[this.mode];this.root.dataset.techMode=this.mode;const picker=this.root.querySelector('[data-tech-select]');if(picker)picker.value=this.mode;const legend=this.root.querySelector('[data-tech-legend]');if(legend)legend.textContent=this.mode==='softener'?'Blau: Hartwasser · Grün: enthärtetes Wasser · Ocker: Sole · Grau: Ablauf':this.mode==='gas'?'Rot: Vorlauf · Blau: Rücklauf · Gelb: Gas · Grau: Abgas / Kondensat':this.mode==='oil'?'Rot: Vorlauf · Blau: Rücklauf · Kupfer: Heizöl · Grau: Abgas / Kondensat':'Warme Farben: Wärme / Vorlauf · Blau: kühlere Bereiche / Rücklauf';const nativeKey=this.root.querySelector('[data-tech-native-key]');if(nativeKey)nativeKey.innerHTML=t.components.map((c,i)=>'<li><span>'+(i+1)+'</span> '+c.name+'</li>').join('');this.root.querySelectorAll('[data-tech-poster]').forEach(p=>{p.hidden=p.dataset.techPoster!==this.mode;});this.root.querySelector('[data-tech-title]').textContent=t.title;this.root.querySelector('[data-tech-summary]').textContent=t.summary;this.root.querySelector('[data-tech-note]').textContent=t.note;this.root.querySelector('[data-tech-scene-title]').textContent=t.scene;this.canvas.setAttribute('aria-label',t.alt);this.root.querySelector('[role=tabpanel]').setAttribute('aria-labelledby','tf-tech-tab-'+this.mode);this.root.querySelectorAll('[data-tech-tab]').forEach(b=>{const selected=b.dataset.techTab===this.mode;b.classList.toggle('is-active',selected);b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;});const list=this.root.querySelector('[data-tech-components]');if(typeof list.replaceChildren==='function')list.replaceChildren();else list.innerHTML='';t.components.forEach((component,i)=>{const b=document.createElement('button');b.type='button';b.dataset.techComponent=String(i);b.textContent=(i+1)+' · '+component.name;list.appendChild(b);});this.updateComponent();this.updateControls();};
  Studio.prototype.updateComponent=function(){const t=THEMES[this.mode].components[this.selected];this.root.querySelector('[data-tech-number]').textContent=String(this.selected+1).padStart(2,'0');this.root.querySelector('[data-tech-component-title]').textContent=t.name;this.root.querySelector('[data-tech-component-text]').textContent=t.text;this.root.querySelectorAll('[data-tech-component]').forEach(b=>{const selected=+b.dataset.techComponent===this.selected;b.classList.toggle('is-active',selected);b.setAttribute('aria-pressed',String(selected));});};
  Studio.prototype.transform=function(p){const cy=Math.cos(this.yaw),sy=Math.sin(this.yaw),cp=Math.cos(this.pitch),sp=Math.sin(this.pitch),x=p[0]*cy+p[2]*sy,z=-p[0]*sy+p[2]*cy;return [x,p[1]*cp-z*sp,p[1]*sp+z*cp];};
  Studio.prototype.camera=function(){
    const old=this.cameraCache;
    if(old&&old.mesh===this.mesh&&old.width===this.width&&old.height===this.height&&old.yaw===this.yaw&&old.pitch===this.pitch)return old;
    const b=this.mesh.bounds,origin=[(b[0]+b[1])/2,(b[2]+b[3])/2,(b[4]+b[5])/2],points=[];
    for(const x of [b[0],b[1]])for(const y of [b[2],b[3]])for(const z of [b[4],b[5]]){const t=this.transform(sub([x,y,z],origin)),depth=9-t[2];points.push([t[0]*9/depth,-t[1]*9/depth]);}
    const minX=Math.min(...points.map(p=>p[0])),maxX=Math.max(...points.map(p=>p[0])),minY=Math.min(...points.map(p=>p[1])),maxY=Math.max(...points.map(p=>p[1]));
    const unit=Math.min((this.width-36)/(maxX-minX||1),(this.height-80)/(maxY-minY||1))*.96;
    return this.cameraCache={mesh:this.mesh,width:this.width,height:this.height,yaw:this.yaw,pitch:this.pitch,origin,unit,x:this.width/2-(minX+maxX)*unit/2,y:(this.height-32)/2-(minY+maxY)*unit/2};
  };
  Studio.prototype.project=function(p){const c=this.camera(),t=this.transform(sub(p,c.origin)),z=9-t[2];return {x:c.x+t[0]*c.unit*9/z,y:c.y-t[1]*c.unit*9/z,z};};
  Studio.prototype.cancel=function(){if(this.request)cancelAnimationFrame(this.request);this.request=0;this.last=0;};
  Studio.prototype.schedule=function(force=false){if(force)this.forceDraw=true;if((this.visible||this.forceDraw)&&!this.request&&!this.destroyed&&!document.hidden)this.request=requestAnimationFrame(t=>{try{this.render(t);}catch(_){this.motion=false;this.forceDraw=false;delete this.root.dataset.techMounted;this.root.dataset.techUnavailable='true';this.view.tabIndex=-1;this.view.setAttribute('aria-label','Schematische Technikansicht');const label=this.root.querySelector('[data-tech-render-label]');if(label)label.textContent='Schematische Technikansicht';this.cancel();}});};
  Studio.prototype.render=function(timestamp){
    this.request=0;if(this.destroyed||!this.width||!this.height||(!this.visible&&!this.forceDraw))return;this.forceDraw=false;
    // Flow animation is intentionally capped at 30 fps for mobile battery use.
    if(this.motion&&this.last&&timestamp-this.last<32&&Math.abs(this.explode-this.targetExplode)<.004){this.schedule();return;}
    const elapsed=this.last?Math.min(timestamp-this.last,50):16;this.last=timestamp;
    if(this.motion&&this.visible)this.time+=elapsed*.001;
    let transitioning=Math.abs(this.explode-this.targetExplode)>.004;
    if(transitioning){this.explode+=(this.targetExplode-this.explode)*Math.min(1,elapsed/105);if(Math.abs(this.explode-this.targetExplode)<.004)this.explode=this.targetExplode;this.mesh=BUILD[this.mode](this.explode);}
    const ctx=this.ctx,w=this.width,h=this.height;
    ctx.fillStyle='#eef4f6';ctx.fillRect(0,0,w,h);
    const backdrop=ctx.createRadialGradient(w*.48,h*.35,0,w*.48,h*.35,w*.75);backdrop.addColorStop(0,'#fbfdfe');backdrop.addColorStop(1,'#eaf1f4');ctx.fillStyle=backdrop;ctx.fillRect(0,0,w,h);
    // A soft contact shadow and a quiet reference plane give depth without a GPU.
    ctx.save();ctx.translate(w*.49,h*.8);ctx.scale(1,.23);const shadow=ctx.createRadialGradient(0,0,0,0,0,w*.36);shadow.addColorStop(0,'rgba(28,70,85,.17)');shadow.addColorStop(1,'rgba(28,70,85,0)');ctx.fillStyle=shadow;ctx.beginPath();ctx.arc(0,0,w*.36,0,TAU);ctx.fill();ctx.restore();
    ctx.strokeStyle='rgba(82,128,146,.07)';ctx.lineWidth=.65;const gy=this.mode==='floor'?-1.04:-1.43;
    for(let i=-4;i<=4;i++){const a=this.project([i,gy,-3]),b=this.project([i,gy,3]),c=this.project([-4,gy,i]),d=this.project([4,gy,i]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.moveTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.stroke();}
    const faces=this.mesh.faces.slice();
    if(this.mesh.fan){const fan=new Mesh(),fc=this.mesh.fan.center,a=this.time*2.4;
      for(let blade=0;blade<5;blade++){const angle=a+blade*TAU/5,pts=[[.08,-.04],[.48,-.13],[.54,.06],[.21,.15]].map(([x,y])=>[fc[0]+x*Math.cos(angle)-y*Math.sin(angle),fc[1]+x*Math.sin(angle)+y*Math.cos(angle),fc[2]-.012]);fan.face(pts,C.steel,1,.08);}faces.push(...fan.faces);
    }
    const projected=faces.map(f=>{const p=f.points.map(v=>this.project(v));return {f,p,z:p.reduce((s,v)=>s+v.z,0)/p.length};}).sort((a,b)=>b.z-a.z);
    const light=norm([-.55,.75,.7]);
    for(const {f,p} of projected){if(p.some(v=>v.z<1))continue;const n=this.transform(f.n),dot=Math.abs(n[0]*light[0]+n[1]*light[1]+n[2]*light[2]),l=.65+dot*.37;
      ctx.globalAlpha=f.alpha;ctx.fillStyle=shade(f.fill,l);ctx.beginPath();ctx.moveTo(p[0].x,p[0].y);for(let i=1;i<p.length;i++)ctx.lineTo(p[i].x,p[i].y);ctx.closePath();ctx.fill();if(f.edge){ctx.globalAlpha=f.alpha*f.edge;ctx.strokeStyle='#163b4c';ctx.lineWidth=.6;ctx.stroke();}
    }
    ctx.globalAlpha=1;
    if(this.motion){this.mesh.flows.forEach((flow,fi)=>{const total=flow.lengths.reduce((s,n)=>s+n,0);for(let i=0;i<flow.count;i++){let d=((this.time*(flow.speed||.1)+i/flow.count+fi*.075)%1)*total,segment=0;while(segment<flow.lengths.length-1&&d>flow.lengths[segment])d-=flow.lengths[segment++];const p=this.project(mix(flow.points[segment],flow.points[segment+1],d/(flow.lengths[segment]||1)));ctx.fillStyle=flow.fill;ctx.globalAlpha=.45;ctx.beginPath();ctx.arc(p.x,p.y,3.5,0,TAU);ctx.fill();ctx.globalAlpha=.95;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p.x,p.y,1.65,0,TAU);ctx.fill();}});ctx.globalAlpha=1;}
    this.drawHotspots();
    if(this.mode==='balance'||this.mode==='softener'){const label=this.mode==='softener'?(this.explode>.5?'Regeneration · Spülwasser zum Abwasser':'Enthärtung · Betrieb'):(this.explode>.5?'Abgeglichen: passend zum Raumbedarf':'Beispiel: ungleiche Verteilung');ctx.font='600 12px Arial,sans-serif';const lw=ctx.measureText(label).width+22;ctx.fillStyle='#ffffffed';roundedRect(ctx,(w-lw)/2,h-48,lw,29,6);ctx.fill();ctx.fillStyle='#063963';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,w/2,h-33.5);}
    this.drawn=true;this.root.dataset.techMounted='true';delete this.root.dataset.techUnavailable;this.view.tabIndex=0;this.view.setAttribute('aria-label','3D-Modell drehen. Pfeiltasten drehen die Ansicht, Pos1 setzt sie zurück.');const renderLabel=this.root.querySelector('[data-tech-render-label]');if(renderLabel)renderLabel.textContent='Interaktives 3D-Modell';
    if(this.visible&&(this.motion||transitioning))this.schedule();
  };
  Studio.prototype.drawHotspots=function(){
    const ctx=this.ctx,w=this.width,h=this.height,small=w<480,theme=THEMES[this.mode];this.hotspots=[];
    const spots=this.mesh.anchors.map((anchor,index)=>({...this.project(anchor),index}));
    // Separate closely projected markers so each component remains tappable.
    for(let i=0;i<spots.length;i++){spots[i].x=clamp(spots[i].x,21,w-21);spots[i].y=clamp(spots[i].y,23,h-58);for(let j=0;j<i;j++){if(Math.hypot(spots[i].x-spots[j].x,spots[i].y-spots[j].y)<29)spots[i].y=clamp(spots[j].y+32,23,h-58);}}
    spots.forEach(p=>{const active=p.index===this.selected;this.hotspots.push(p);if(active){ctx.strokeStyle='#06396325';ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.x,p.y,21,0,TAU);ctx.stroke();}ctx.save();ctx.shadowColor='#06396320';ctx.shadowBlur=8;ctx.shadowOffsetY=2;ctx.fillStyle=active?'#063963':'#ffffff';ctx.beginPath();ctx.arc(p.x,p.y,14,0,TAU);ctx.fill();ctx.restore();ctx.strokeStyle=active?'#063963':'#cadbe2';ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.x,p.y,14,0,TAU);ctx.stroke();ctx.fillStyle=active?'#fff':'#063963';ctx.font='600 12px Arial,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(p.index+1),p.x,p.y+.5);
      if(active&&!small){const text=theme.components[p.index].name;ctx.font='600 '+(small?'12':'13')+'px Arial,sans-serif';const tw=ctx.measureText(text).width,bw=tw+20,bh=31;let x=p.x+20;if(x+bw>w-12)x=p.x-20-bw;x=clamp(x,10,w-bw-10);let y=p.y-15.5;if(spots.some(q=>q.index!==p.index&&q.x>x-15&&q.x<x+bw+15&&Math.abs(q.y-p.y)<26))y=p.y-46;y=clamp(y,8,h-39);ctx.fillStyle='#ffffffee';roundedRect(ctx,x,y,bw,bh,5);ctx.fill();ctx.strokeStyle='#cfdee5';ctx.lineWidth=.8;ctx.stroke();ctx.fillStyle='#063963';ctx.textAlign='left';ctx.fillText(text,x+10,y+bh/2+.5);}
    });
  };
  Studio.prototype.destroy=function(){this.destroyed=true;this.cancel();this.cleanup.forEach(fn=>fn());if(this.intersection)this.intersection.disconnect();if(this.resizer)this.resizer.disconnect();delete this.root.dataset.techReady;delete this.root.dataset.techMounted;};
  const instances=new Map();
  function init(scope=document){scope.querySelectorAll('[data-tf-3d]').forEach(root=>{if(!instances.has(root))instances.set(root,new Studio(root));});return Array.from(instances.values());}
  // Optional integration API; automatic initialization is sufficient for static HTML.
  window.ThermofisTechnik3D={init,destroy:function(root){const instance=instances.get(root);if(instance){instance.destroy();instances.delete(root);}},version:'1.2.0'};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>init(),{once:true});else init();
})();
