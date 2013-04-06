from pyplasm import *

#PIANO TERRA
#definisco il pilastro circolare
circPill = CYLINDER([0.125,2.45])(36)
circPill_firstRow_0 = T([1])([0.125])(circPill)

#definisco il pilastro rettangolare
squarePill = PROD([CUBOID([0.25,0.25]),Q(2.45)])
squarePill = T([2])([-0.125])(squarePill)

#definisco blocchi di raccordo
circJunction = CYLINDER([0.125,0.25])(36)
circJunction = T([1])([0.125])(circPill)
squareJunction = PROD([CUBOID([0.25,0.25]),Q(0.25)])
squareJunction = T([2])([-0.125])(squareJunction)

#pilastri esterni, prima riga

traslation = T([1])([2.75])
external_pillars_0 = STRUCT(NN(5)([circPill_firstRow_0, traslation]))
external_junctions_0 = STRUCT(NN(5)([T([3])([-0.25])(circJunction), traslation]))
external_pillars_0 = STRUCT([external_pillars_0,external_junctions_0])

#pilastri interni, seconda riga
#prima i cilindrici
circPill_secondRow_0 = T([2])([5.25])(circPill_firstRow_0)
#poi i quadrati
squarePill_secondRow_0 = T([1])([2.75])(squarePill)
squarePill_secondRow_0 = T([2])([5.25])(squarePill_secondRow_0)
internal_pillars_0 = STRUCT([circPill_secondRow_0, STRUCT(NN(3)([squarePill_secondRow_0,traslation]))])

pillars0 = STRUCT([external_pillars_0,internal_pillars_0])


#PRIMO PIANO

squarePill_short = PROD([CUBOID([0.25,0.25]),Q(2.25)])
squarePill_short = T([2])([-0.125])(squarePill_short)
circPill_short = CYLINDER([0.125,2.25])(36)
circPill_short = T([1])([0.125])(circPill_short)

#pilastri esterni, prima riga, primo piano
squarePill_firstRow_1 = T([3])([2.70])(squarePill_short)
external_pillars_1 = STRUCT(NN(5)([squarePill_firstRow_1, traslation]))

#pilastri interni, seconda riga, primo piano
squarePill_secondRow_1 = T([2])([5.25])(squarePill_firstRow_1)
internal_pillars_1 = STRUCT(NN(3)([squarePill_secondRow_1, traslation]))
lastSquarePill_secondRow_1 = T([1])([11])(squarePill_secondRow_1)
#l'unico pilastro cilindrico
third_circPill_secondoRow_1 = T([1,2,3])([8.25,5.25,2.70])(circPill_short)
internal_pillars_1 = STRUCT([internal_pillars_1, third_circPill_secondoRow_1, lastSquarePill_secondRow_1])
#aggiungo i raccordi per col secondo piano
squareJunction_firstRow_1 = T([3])([5.20-0.25])(squareJunction)
external_Junction_firstRow_1 = STRUCT(NN(3)([squareJunction_firstRow_1, traslation]))
squareJunction_secondRow_1 = T([1,2,3])([2.75,5.25,5.20-0.25])(squareJunction)

pillars1 = STRUCT([internal_pillars_1,external_pillars_1,external_Junction_firstRow_1,squareJunction_secondRow_1])


#SECONDO PIANO
#partire da 5.2
#pilastri interni, prima riga, secondo piano
squarePill_firstRow_2 = T([3])([5.20])(squarePill_short)
external_pillars_2 = STRUCT(NN(3)([squarePill_firstRow_2, traslation]))
lastSquarePill_firstRow_2 = T([1])([11])(squarePill_firstRow_2)
external_pillars_2 = STRUCT([external_pillars_2, lastSquarePill_firstRow_2])

#pilastri esterni, seconda riga, secondo piano
squarePill_secondRow_2 = T([2,3])([5.25, 5.20])(squarePill_short)
internal_pillars_2 = STRUCT(NN(5)([squarePill_secondRow_2, traslation]))

#aggiungo i raccordi per col terzo piano
squareJunction_firstRow_2 = T([1,3])([5.5,7.70-0.25])(squareJunction)

pillars2 = STRUCT([external_pillars_2,internal_pillars_2,squareJunction_firstRow_2])


#TERZO PIANO
#definisco il pilastro rettangolare per l'ultimo piano (più basso)
squarePill_3 = PROD([CUBOID([0.25,0.25]),Q(2.30)])
squarePill_3 = T([2])([-0.125])(squarePill_3)
squarePill_small_3 = PROD([CUBOID([0.125,0.125]),Q(2.30)])
squarePill_small_3 = T([2])([-0.125])(squarePill_small_3)

#pilastri esterni, prima riga
squarePill1_firstRow_3 = T([1,3])([5.5,7.70])(squarePill_3)
squarePill2_firstRow_3 = T([1])([5.5])(squarePill1_firstRow_3)
external_pillars_3 = STRUCT([squarePill1_firstRow_3,squarePill2_firstRow_3])

#pilastri interni, seconda riga
#pilastri piccoli
squarePill1_small_secondRow_3 = T([2,3])([5.375,7.70])(squarePill_small_3)
squarePill2_small_secondRow_3 = T([1])([2.75])(squarePill1_small_secondRow_3)
squarePills_small_secondRow_3 = STRUCT([squarePill1_small_secondRow_3,squarePill2_small_secondRow_3])
#pilastri grande
squarePill_secondRow_3 = T([1,2,3])([5.5,5.25,7.70])(squarePill_3)
internal_pillars_3 = STRUCT(NN(3)([squarePill_secondRow_3, traslation]))
internal_pillars_3 = STRUCT([internal_pillars_3, squarePills_small_secondRow_3])

pillars3 = STRUCT([external_pillars_3,internal_pillars_3])


building = STRUCT([pillars0, pillars1, pillars2, pillars3])
VIEW(building) 
