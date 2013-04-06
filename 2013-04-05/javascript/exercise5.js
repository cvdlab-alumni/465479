 
//========================== UTILITIES ============================================================

T = function (dims) {
  dims = dims.map(function(item){
    return item-1;
  });
  return function (values) {
    return function (object) {
      return object.clone().translate(dims,values);
    };
  };
}

S = function (dims) {
  dims = dims.map(function(item){
    return item-1;
  });
    return function (values) {
      return function (object) {
        return object.clone().scale(dims, values);
      };
    };
  }

 R = function (dims) {
  dims = dims.map(function(item){
    return item-1;
  });
    return function (angle) {
      return function (object) {
        return object.clone().rotate(dims, angle);
      };
    };
  }

  S3 = S2;
  S2 = S1;
  S1 = S0;

  GRID = SIMPLEX_GRID

  VIEW = DRAW
//===================================================================================================

//PIANO TERRA
//definisco il pilastro circolare
var circPill = EXTRUDE([2.45])(DISK(0.125)(36));
var circPill_firstRow_0 = T([1])([0.125])(circPill);

//definisco il pilastro rettangolare
var squarePill = EXTRUDE([2.45])(CUBOID([0.25,0.25]));
squarePill = T([2])([-0.125])(squarePill);

//definisco blocchi di raccordo
var circJunction = EXTRUDE([0.25])(DISK(0.125)(36));
circJunction = T([1])([0.125])(circPill);
var squareJunction = EXTRUDE([0.25])(CUBOID([0.25,0.25]));
squareJunction = T([2])([-0.125])(squareJunction);

//pilastri esterni, prima riga

var traslation = T([1])([2.75]);
var external_pillars_0 = STRUCT(REPLICA(5)([circPill_firstRow_0, traslation]));
var external_junctions_0 = STRUCT(REPLICA(5)([T([3])([-0.25])(circJunction), traslation]));
external_pillars_0 = STRUCT([external_pillars_0,external_junctions_0]);

//pilastri interni, seconda riga
//prima i cilindrici
var circPill_secondRow_0 = T([2])([5.25])(circPill_firstRow_0);
//poi i quadrati
var squarePill_secondRow_0 = T([1])([2.75])(squarePill);
squarePill_secondRow_0 = T([2])([5.25])(squarePill_secondRow_0);
internal_pillars_0 = STRUCT([circPill_secondRow_0, STRUCT(REPLICA(3)([squarePill_secondRow_0,traslation]))]);

var pillars0 = STRUCT([external_pillars_0,internal_pillars_0]);



//PRIMO PIANO

var squarePill_short = EXTRUDE([2.25])(CUBOID([0.25,0.25]));
squarePill_short = T([2])([-0.125])(squarePill_short);
var circPill_short = EXTRUDE([2.25])(DISK(0.125)(36));
circPill_short = T([1])([0.125])(circPill_short);

//pilastri esterni, prima riga, primo piano
var squarePill_firstRow_1 = T([3])([2.70])(squarePill_short);
var external_pillars_1 = STRUCT(REPLICA(5)([squarePill_firstRow_1, traslation]));

//pilastri interni, seconda riga, primo piano
var squarePill_secondRow_1 = T([2])([5.25])(squarePill_firstRow_1);
var internal_pillars_1 = STRUCT(REPLICA(3)([squarePill_secondRow_1, traslation]));
var lastSquarePill_secondRow_1 = T([1])([11])(squarePill_secondRow_1);
//l'unico pilastro cilindrico
var third_circPill_secondoRow_1 = T([1,2,3])([8.25,5.25,2.70])(circPill_short);
internal_pillars_1 = STRUCT([internal_pillars_1, third_circPill_secondoRow_1, lastSquarePill_secondRow_1]);
//aggiungo i raccordi per col secondo piano
var squareJunction_firstRow_1 = T([3])([5.20-0.25])(squareJunction);
var external_Junction_firstRow_1 = STRUCT(REPLICA(3)([squareJunction_firstRow_1, traslation]));
var squareJunction_secondRow_1 = T([1,2,3])([2.75,5.25,5.20-0.25])(squareJunction);

var pillars1 = STRUCT([internal_pillars_1,external_pillars_1,external_Junction_firstRow_1,squareJunction_secondRow_1]);


//SECONDO PIANO
//partire da 5.2
//pilastri interni, prima riga, secondo piano
var squarePill_firstRow_2 = T([3])([5.20])(squarePill_short);
var external_pillars_2 = STRUCT(REPLICA(3)([squarePill_firstRow_2, traslation]));
var lastSquarePill_firstRow_2 = T([1])([11])(squarePill_firstRow_2);
var external_pillars_2 = STRUCT([external_pillars_2, lastSquarePill_firstRow_2]);

//pilastri esterni, seconda riga, secondo piano
var squarePill_secondRow_2 = T([2,3])([5.25, 5.20])(squarePill_short);
var internal_pillars_2 = STRUCT(REPLICA(5)([squarePill_secondRow_2, traslation]));

//aggiungo i raccordi per col terzo piano
var squareJunction_firstRow_2 = T([1,3])([5.5,7.70-0.25])(squareJunction);

var pillars2 = STRUCT([external_pillars_2,internal_pillars_2,squareJunction_firstRow_2]);


//TERZO PIANO
//definisco il pilastro rettangolare per l'ultimo piano (più basso)
var squarePill_3 = EXTRUDE([2.30])(CUBOID([0.25,0.25]));
squarePill_3 = T([2])([-0.125])(squarePill_3);
var squarePill_small_3 = EXTRUDE([2.30])(CUBOID([0.125,0.125]));
squarePill_small_3 = T([2])([-0.125])(squarePill_small_3);

//pilastri esterni, prima riga
var squarePill1_firstRow_3 = T([1,3])([5.5,7.70])(squarePill_3);
var squarePill2_firstRow_3 = T([1])([5.5])(squarePill1_firstRow_3);
var external_pillars_3 = STRUCT([squarePill1_firstRow_3,squarePill2_firstRow_3]);

//pilastri interni, seconda riga
//pilastri piccoli
var squarePill1_small_secondRow_3 = T([2,3])([5.375,7.70])(squarePill_small_3);
var squarePill2_small_secondRow_3 = T([1])([2.75])(squarePill1_small_secondRow_3);
var squarePills_small_secondRow_3 = STRUCT([squarePill1_small_secondRow_3,squarePill2_small_secondRow_3]);
//pilastri grande
var squarePill_secondRow_3 = T([1,2,3])([5.5,5.25,7.70])(squarePill_3);
var internal_pillars_3 = STRUCT(REPLICA(3)([squarePill_secondRow_3, traslation]));
internal_pillars_3 = STRUCT([internal_pillars_3, squarePills_small_secondRow_3]);

var pillars3 = STRUCT([external_pillars_3,internal_pillars_3]);



//EXERCISE 1
var prato = SIMPLEX_GRID([[11.25],[7+0.125],[0.05]]);
prato = COLOR([0,1,0])(prato);
prato = T([2,3])([-0.125,-0.25])(prato);

//Pavimento piano terra
//prima griglia, base per scalette esterne
var little_stairs_0 = SIMPLEX_GRID([[1.50],[-5.125,1.875],[0.25]]);

//cella centrale, piano terra
var central_cell_0 = SIMPLEX_GRID([[-1.5,7],[-2,5],[0.25]]);

//sx cell
var sx_cell_0 = SIMPLEX_GRID([[-1.5,-7,1.3],[-2,-2.1,2.9],[0.25]]);

//semicerchio destro
function annulus_sector (alpha, r, R) {
  var domain = DOMAIN([[0,alpha],[r,R]])([36,1]);
  var mapping = function (v) {
    var a = v[0];
    var r = v[1];
    return [r*COS(a), r*SIN(a)];
  }
  var model = MAP(mapping)(domain);
  return model;
}
var semicircle_0 = annulus_sector(PI, 0, 1.25 + 0.20);
semicircle_0 = R([1,2])([-PI/2])(semicircle_0);
semicircle_0 = T([1,2])([1.5+7+1.3,2+2.5+1.25 -0.2])(semicircle_0);
semicircle_0 = EXTRUDE([0.25])(semicircle_0);

//down micro cell
var dw_cell_0 = SIMPLEX_GRID([[-1.50,1],[-1,1],[0.25]]);

//semicerchio in basso
var little_semicirle_0 = annulus_sector(PI,0,0.5);
little_semicirle_0 = R([1,2])([PI])(little_semicirle_0);
little_semicirle_0 = T([1,2])([1.5+0.5,1])(little_semicirle_0);
little_semicirle_0 = EXTRUDE([0.25])(little_semicirle_0);

var ground_floor = STRUCT([little_stairs_0,central_cell_0,sx_cell_0,semicircle_0,dw_cell_0, little_semicirle_0])
ground_floor = T([3])([-0.25])(ground_floor);

//Pavimento primo piano
var floor_1_1 = SIMPLEX_GRID([[11.25],[5.50],[0.25]]);
var floor_2_1 = SIMPLEX_GRID([[4.95],[1.625],[0.25]]);
floor_2_1 = T([1,2])([6.30,5.50])(floor_2_1);
var floor_3_1 = SIMPLEX_GRID([[3.8],[1.875],[0.25]]);
floor_3_1 = T([1,2])([-1.5,5.25])(floor_3_1);
var floor_4_1 = SIMPLEX_GRID([[6.30],[0.25],[0.25]]);
floor_4_1 = T([2])([6.875])(floor_4_1);

var floor_1 = STRUCT([floor_1_1,floor_2_1,floor_3_1,floor_4_1]);
floor_1 = T([2,3])([-0.125,2.45])(floor_1);

//Pavimento secondo piano
var floor_1_2 = GRID([[5.75],[7],[0.25]]);
floor_1_2 = T([1])([5.5])(floor_1_2);
var floor_2_2 = GRID([[0.5],[1.5],[0.25]]);
floor_2_2 = T([1,2])([5,5.50])(floor_2_2);
var verts = [[5.5,0],[5.5,5.5],[5,5.5]];
var cells = [[0,1,2]];
var floor_3_2 = SIMPLICIAL_COMPLEX(verts)(cells);
floor_3_2 = EXTRUDE([0.25])(floor_3_2);
var floor_4_2 = GRID([[5],[0.25],[0.25]]);
floor_4_2 = T([1,2])([0.25,7-0.25])(floor_4_2);
var floor_5_2 = GRID([[0.25],[1.75],[0.25]]);
floor_5_2 = T([2])([5.25])(floor_5_2);

var floor_2 = STRUCT([floor_1_2,floor_2_2,floor_3_2,floor_4_2,floor_5_2]);
floor_2 = T([2,3])([-0.125,4.95])(floor_2);


//Pavimento terzo piano
//prima griglia a sinistra del terzo piano
var sx_cell_3 = SIMPLEX_GRID([[5.75],[7],[0.25]]);

//prima griglia a destra del terzo piano
var dx_cell_3 = SIMPLEX_GRID([[-5.75,3.125],[5.525],[0.25]]);

//seconda griglia a destra del terzo piano
var dx_second_cell_3 = SIMPLEX_GRID([[-5.75,-3,2.5],[5.4,1.6],[0.25]]);

var floor3 = STRUCT([sx_cell_3,dx_cell_3,dx_second_cell_3]);
floor3 = T([2,3])([-0.125,7.45])(floor3);


//QURATO PIANO: Tetto
var sx_cell_4 = SIMPLEX_GRID([[5.625],[0.25,-5,1.75],[0.25]]);

//prima griglia a destra del terzo piano
var dx_cell_4 = SIMPLEX_GRID([[-5.625,5.625],[7],[0.25]]);
//contorno
var crosswalk = SIMPLEX_GRID([[0.25],[0.25,5],[0.25]]);

var floor4 = STRUCT([sx_cell_4,dx_cell_4,crosswalk]);
floor4 = T([2,3])([-0.125,9.75])(floor4);


floors = STRUCT([floor_1,floor_2,floor3,ground_floor,floor4]);


//Muro ovest
var west_1 = SIMPLEX_GRID([[11.25],[0.25],[1.25]]);
west_1 = T([3])([2.45])(west_1);
var west_21 = SIMPLEX_GRID([[2.75],[0.25],[1.2]]);
west_21 = T([3])([3.7])(west_21);
var west_22 = SIMPLEX_GRID([[5.75],[0.25],[1.2]]);
west_22 = T([1,3])([5.5,3.7])(west_22);
var west_3 = SIMPLEX_GRID([[11.25],[0.25],[1.30]]);
west_3 = T([3])([2.45+1.25+1.20])(west_3);
var west_41 = SIMPLEX_GRID([[1.75],[0.25],[1.20]]);
west_41 = T([3])([2.45+1.25+1.40+1.10])(west_41);
var west_42 = SIMPLEX_GRID([[0.25],[0.25],[1.20]]);
west_42 = T([1,3])([2,2.45+1.25+1.40+1.10])(west_42);
var west_43 = SIMPLEX_GRID([[8.75],[0.25],[1.20]]);
west_43 = T([1,3])([2.50,2.45+1.25+1.40+1.10])(west_43);
var west_5 = SIMPLEX_GRID([[11.25],[0.25],[2.95]]);
west_5 = T([3])([2.45+1.25+1.40+1.25+1])(west_5);

west = STRUCT([west_1,west_21,west_22,west_3,west_41,west_42,west_43,west_5]);
west = T([1,2])([11.25,7])(R([1,2])(PI)(west));

//GROUND FLOOR
//muro lato ovest
var west_wall = SIMPLEX_GRID([[1.50,5, -0.6,1.4 ,1.5],[-5.125,-1.625,0.25],[2.45]]);
//finestra del lato ovest
west_central_window =  SIMPLEX_GRID([[-1.50,-5, 0.6,-1.4 ,-1.5],[-5.125,-1.625,0.25],[1.45,-0.5,0.5]]);
var west_groundfloor = STRUCT([west_wall,west_central_window]);

west = STRUCT([west, west_groundfloor]);


//ESERCIZIO 3
//Muro est
var est_1 = SIMPLEX_GRID([[11.25],[0.25],[1.25]]);
est_1 = T([3])([2.45])(est_1);
var est_21 = SIMPLEX_GRID([[5.75],[0.25],[1.2]]);
est_21 = T([3])([2.45+1.25])(est_21);
var est_22 = SIMPLEX_GRID([[11.25-8.25],[0.25],[1.2]]);
est_22 = T([1,3])([5.5+2.75,2.45+1.25])(est_22);
var est_3 = SIMPLEX_GRID([[11.25],[0.25],[1.30]]);
est_3 = T([3])([2.45+1.25+1.20])(est_3);
var est_41 = SIMPLEX_GRID([[5.75],[0.25],[1.2]]);
est_41 = T([3])([2.45+1.25+1.40+1.10])(est_41);
var est_42 = SIMPLEX_GRID([[11.25-8.25],[0.25],[1.2]]);
est_42 = T([1,3])([5.5+2.75,2.45+1.25+1.40+1.10])(est_42);
var est_5 = SIMPLEX_GRID([[11.25],[0.25],[1]]);
est_5 = T([3])([2.45+1.25+1.40+1.3+1])(est_5);
var est_6 = SIMPLEX_GRID([[5.5],[0.25],[0.15]]);
est_6 = T([1,3])([5.75,2.45+1.25+1.40+2+1.30])(est_6);
var est_7 = SIMPLEX_GRID([[11.25-8.25],[0.25],[1.2]]);
est_7 = T([1,3])([5.5+2.75,2.45+1.25+1.40+2+1.30+0.1])(est_7);
var est_8 = SIMPLEX_GRID([[11.25],[0.25],[0.6]]);
est_8 = T([3])([2.45+1.25+1.40+2+1.30+0.1+1.20])(est_8);

//cornice finestra
//orizzontale
var ew1 = SIMPLEX_GRID([[2.495],[0.10],[0.025]]);
var ew2 = SIMPLEX_GRID([[2.495],[0.025],[0.025]]);
ew2 = T([3])([1.19])(ew2);
//verticale
var ew3 = SIMPLEX_GRID([[0.025],[0.025],[1.19]]);
var ew4 = T([1])([2.475])(ew3);
var ew5 = T([1])([1.25])(ew3);

//vetri finestra
var east_glass = COLOR([0,0,0,0.5])(SIMPLEX_GRID([[2.495],[0.01],[1.19]]));

var eastWindow = COLOR([0,0,0])(STRUCT([ew1,ew2,ew3,ew4,ew5]));
eastWindow  = STRUCT([eastWindow,east_glass]);
eastWindow = T([1,3])([5.75,3.7])(eastWindow);

est = STRUCT([est_1,est_21,est_22,est_3,est_41,est_42,est_5,est_6,est_7,est_8,eastWindow]);
est = T([2])([-0.13])(est);

//GROUND FLOOR
var east_central_window =SIMPLEX_GRID([[-1.5,-1,-3,3],[-1,-1,0.25],[1.25,-0.7,0.5]]);
var micro_annulus_wall = annulus_sector(PI,0.25,0.5);
micro_annulus_wall = R([1,2])([PI])(micro_annulus_wall);
micro_annulus_wall = T([1,2])([1.5+0.5,1])(micro_annulus_wall);
micro_annulus_wall = EXTRUDE([2.45])(micro_annulus_wall);

var sub_annulus_wall = SIMPLEX_GRID([[-1.5,-7,1.3],[-2,-2.1,0.25],[2.45]]);
var east_wall = SIMPLEX_GRID([[-1.5,-0.75,3.25],[-1,-1,0.25],[2.45]]);
var east_groundfloor = STRUCT([east_central_window,micro_annulus_wall,sub_annulus_wall,east_wall]);

east = STRUCT([est,east_groundfloor]);


//Muro nord
//verticali
var nord_1 = SIMPLEX_GRID([[0.25],[0.25],[7.85]]);
nord_1 = T([3])([2.45])(nord_1);
var nord_2 = SIMPLEX_GRID([[1.25],[0.25],[7.85]]);
nord_2 = T([1,3])([5.25,2.45])(nord_2);
var nord_3 = SIMPLEX_GRID([[0.25],[0.25],[7.85]]);
nord_3 = T([1,3])([6.75,2.45])(nord_3);
//orizzontali
var nord_4 = SIMPLEX_GRID([[5],[0.25],[1.30]]);
nord_4 = T([1,3])([0.25,2.45])(nord_4);
var nord_5 = T([3])([1.25+1.3])(nord_4);
var nord_6 = T([3])([1.25+1.3])(nord_5);
var nord_7 = SIMPLEX_GRID([[5],[0.25],[0.60]]);
nord_7 = T([1,3])([0.25,2.45+1.25+1.40+2+1.30+0.1+1.20])(nord_7);
var nord_8 = SIMPLEX_GRID([[0.25],[0.25],[0.60]]);
nord_8 = T([1,3])([6.5,2.45+1.25+1.40+2+1.30+0.1+1.20])(nord_8);
var nord_9 = SIMPLEX_GRID([[0.25],[0.25],[0.5]]);
nord_9 = T([1,3])([6.5,2.45])(nord_9);
var nord_10 = T([3])([1.25+1.3])(nord_9);
var nord_11 = T([3])([1.25+1.3])(nord_10);

//cornice finestra
//orizzontale
var nw1 = SIMPLEX_GRID([[4.85],[0.10],[0.025]]);
var nw2 = SIMPLEX_GRID([[4.85],[0.025],[0.025]]);
nw2 = T([3])([1.19])(nw2);
//verticale
var nw3 = SIMPLEX_GRID([[0.025],[0.025],[1.19]]);
var nw4 = T([1])([2.475])(nw3);
var nw5 = T([1])([2.52])(nw3);
var nw6 = T([1])([1.25])(nw3);
var nw7 = T([1])([3.75])(nw3);
var nw8 = T([1])([4.85])(nw3);

//vetri finestra
var north_glass = COLOR([0,0,0,0.5])(SIMPLEX_GRID([[4.85],[0.01],[1.19]]));

var northWindow = COLOR([0,0,0])(STRUCT([nw1,nw2,nw3,nw4,nw5,nw6,nw7,nw8]));
northWindow  = STRUCT([northWindow,north_glass]);
northWindow = T([1,3])([0.25,3.75])(northWindow);

var nord = STRUCT([nord_1,nord_2,nord_3,nord_4,nord_5,nord_6,nord_7,nord_8, nord_9,nord_10,nord_11,northWindow]);
nord = T([1])([11.25])(R([1,2])(PI/2)(nord));

//GROUND FLOOR
//muro annulus
function annulus_sector (alpha, r, R) {
  var domain = DOMAIN([[0,alpha],[r,R]])([36,1]);
  var mapping = function (v) {
    var a = v[0];
    var r = v[1];
    return [r*COS(a), r*SIN(a)];
  }
  var model = MAP(mapping)(domain);
  return model;
}
var annulus_wall = annulus_sector(PI, 1.2, 1.45);
annulus_wall = R([1,2])([-PI/2])(annulus_wall);
annulus_wall = T([1,2])([1.5+7+1.3,2+2.5+1.25 -0.2])(annulus_wall);
annulus_wall = EXTRUDE([2.45])(annulus_wall);

//feritoia del piccolo bagno del piano terra
var north_micro_vertical_window = SIMPLEX_GRID([[-1.5,-0.75,0.25],[-1,-0.8,0.2],[1.25,-1, 0.25]]);
var vertical_wall = SIMPLEX_GRID([[-1.5,-6.75,0.25],[-2,1.2,-0.9, 0.25],[2.45]]);
var micro_vertical_wall2 = SIMPLEX_GRID([[-1.5,-0.75,0.25],[-1,0.8],[2.45]]);
var north_groundfloor = STRUCT([vertical_wall,annulus_wall,north_micro_vertical_window,micro_vertical_wall2]);

north = STRUCT([nord, north_groundfloor]);



//Muro sud
//orizzontali
var sud_1 = SIMPLEX_GRID([[5.2],[0.25],[0.30]]);
sud_1 = T([1,3])([1.50,2.45])(sud_1);
var sud_2 = SIMPLEX_GRID([[6.7],[0.25],[0.35]]);
sud_2 = T([3])([4.9])(sud_2);
var sud_3 = SIMPLEX_GRID([[6.7],[0.25],[1]]);
sud_3 = T([3])([7.40])(sud_3);
var sud_4 = SIMPLEX_GRID([[7],[0.25],[0.60]]);
sud_4 = T([3])([2.45+1.25+1.40+2+1.30+0.1+1.20])(sud_4);
var sud_45 = SIMPLEX_GRID([[1.875],[0.10],[1.20]]);
sud_45 = T([2,3])([-1.5,2.70])(sud_45);
//Verticali
var sud_5 = SIMPLEX_GRID([[0.30],[0.25],[7.85]]);
sud_5 = T([1,3])([6.7,2.45])(sud_5);
var sud_6 = SIMPLEX_GRID([[1.65],[0.25],[2.20]]);
sud_6 = T([3])([5.20])(sud_6);
var sud_7 = SIMPLEX_GRID([[0.25],[0.25],[2.20]]);
sud_7 = T([3])([2.70])(sud_7);
var sud_8 = SIMPLEX_GRID([[0.25],[0.25],[2.20]]);
sud_8 = T([1,3])([1.5,2.70])(sud_8);
var sud_9 = SIMPLEX_GRID([[0.10],[0.10],[1.3]]);
sud_9 = T([3])([2.45+1.25+1.40+2+1.30])(sud_9);
sud_10 = T([1])([1.625])(sud_9);

//cornice finestra
//orizzontale
var sw1 = SIMPLEX_GRID([[4.80],[0.025],[0.025]]);
var sw2 = T([3])([1.065])(sw1);
//verticale
var sw3 = SIMPLEX_GRID([[0.025],[0.025],[1.065]]);
var sw4 = T([1])([2.475])(sw3);
var sw5 = T([1])([2.52])(sw3);
var sw6 = T([1])([1.25])(sw3);
var sw7 = T([1])([3.75])(sw3);
var sw8 = T([1])([4.80])(sw3);

//vetri finestra
var south_glass = COLOR([0,0,0,0.5])(SIMPLEX_GRID([[4.80],[0.01],[1.065]]));

var southWindow = COLOR([0,0,0])(STRUCT([sw1,sw2,sw3,sw4,sw5,sw6,sw7,sw8]));
southWindow  = STRUCT([southWindow,south_glass]);
southWindow = T([1,3])([1.875,2.75])(southWindow);
southWindow1 = T([3])([1.065])(southWindow);
southWindow = STRUCT([southWindow,southWindow1])

var sud = STRUCT([sud_1,sud_2,sud_3,sud_4,sud_45,sud_5,sud_6,sud_7,sud_8,sud_9,sud_10,southWindow]);
sud = T([2])([7])(R([1,2])(-PI/2)(sud));

//GROUND FLOOR
var micro_vertical_wall1 = SIMPLEX_GRID([[-1.5,0.25],[-1,1,-3.125,0.25],[2.45]]);
//finestra sul lato sud del piano terra
var south_window = SIMPLEX_GRID([[-1.5,0.25],[-1,-1,3.125],[1.25,-1,0.2]]);
var south_groundfloor = STRUCT([micro_vertical_wall1,south_window]);

south = STRUCT([sud, south_groundfloor]);
 
 
//ESERCIZIO 5
// stair1
var depth = 0.266;
var n_steps = 15;
var larghezza_step = 1.875-0.25;
var raiser = (2.45+0.25)/(n_steps);
var step2D = SIMPLICIAL_COMPLEX([[0,0],[0,0.14+raiser],[depth,raiser],[depth,0.14+raiser]])([[0,2,1],[1,2,3]]);
var step3D = MAP([S1,S3,S2])(EXTRUDE([larghezza_step])(step2D));
var ramp_0 = STRUCT(REPLICA(n_steps)([step3D,T([1,3])([depth,raiser])]));
stair1 = T([1,2,3])([1.5+1, 5.125+0.25,-0.14])(ramp_0);


// stair2
var depth = 0.266;
var n_steps = 15;
var larghezza_step = 1.875-0.25;
var raiser = (2.25+0.25)/(n_steps);
var step2D = SIMPLICIAL_COMPLEX([[0,0],[0,0.14+raiser],[depth,raiser],[depth,0.14+raiser]])([[0,2,1],[1,2,3]]);
var step3D = MAP([S1,S3,S2])(EXTRUDE([larghezza_step])(step2D));
var ramp_1 = STRUCT(REPLICA(n_steps)([step3D,T([1,3])([depth,raiser])]));
stair2 = T([1,2,3])([1.5-(0.266), 5.125+0.25,-0.14+2.7])(ramp_1);


// stair3
var depth = 0.2;
var n_steps = 15;
var larghezza_step = 1.875-0.25;
var raiser = (2.25 + 0.25)/(n_steps);
var step2D = SIMPLICIAL_COMPLEX([[0,0],[0,0.14+raiser],[depth,raiser],[depth,0.14+raiser]])([[0,2,1],[1,2,3]]);
var step3D = MAP([S1,S3,S2])(EXTRUDE([larghezza_step])(step2D));
var ramp_2 = STRUCT(REPLICA(n_steps)([step3D,T([1,3])([depth,raiser])]));
stair3 = T([1,2,3])([1.5+4+0.4, 5.125+0.25,-0.14+2.7+2.5])(ramp_2);


building = STRUCT([pillars0, pillars1, pillars2, pillars3, floors, prato,west,east,north,south,stair1,stair2,stair3]);
VIEW(building);  