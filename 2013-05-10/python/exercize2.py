#----------------------------------------------------------
#FULLY COMMENTED AND REFACTORED CODE IS ON THE exercize5.py
#-------------------------------------PACE GIOVANNI--------

from pyplasm import *
import scipy
from scipy import *


#---------------------------------------------------------
def VERTEXTRUDE((V,coords)):
    """
Utility function to generate the output model vertices in a
multiple extrusion of a LAR model.
V is a list of d-vertices (each given as a list of d coordinates).
coords is a list of absolute translation parameters to be applied to
V in order to generate the output vertices.
Return a new list of (d+1)-vertices.
"""
    return CAT(AA(COMP([AA(AR),DISTR]))(DISTL([V,coords])))

def cumsum(iterable):
    # cumulative addition: list(cumsum(range(4))) => [0, 1, 3, 6]
    iterable = iter(iterable)
    s = iterable.next()
    yield s
    for c in iterable:
        s = s + c
        yield s

def larExtrude(model,pattern):
    V,FV = model
    d = len(FV[0])
    offset = len(V)
    m = len(pattern)
    outcells = []
    for cell in FV:
        # create the indices of vertices in the cell "tube"
        tube = [v + k*offset for k in range(m+1) for v in cell]
        # take groups of d+1 elements, via shifting by one
        rangelimit = len(tube)-d
        cellTube = [tube[k:k+d+1] for k in range(rangelimit)]
        outcells += [scipy.reshape(cellTube,newshape=(m,d,d+1)).tolist()]
    outcells = AA(CAT)(TRANS(outcells))
    outcells = [group for k,group in enumerate(outcells) if pattern[k]>0 ]
    coords = list(cumsum([0]+(AA(ABS)(pattern))))
    outVerts = VERTEXTRUDE((V,coords))
    newModel = outVerts, CAT(outcells)
    return newModel

def GRID(args):
    model = ([[]],[[0]])
    for k,steps in enumerate(args):
        model = larExtrude(model,steps*[1])
    V,cells = model
    verts = AA(list)(scipy.array(V) / AA(float)(args))
    return MKPOL([verts, AA(AA(lambda h:h+1))(cells), None])
#---------------------------------------------------------

def bezier_generators(c_points):
    c_points_array = []
    for l in c_points:
        c_points_array.append(POLYLINE(l))
    return c_points_array

def make_bezier(b_generators):
    domain = GRID([25,25])
    mapping = BEZIERSURFACE(b_generators)
    element_in_3D = MAP(mapping)(domain)
    return element_in_3D

def make_bezier_line(b_generators):
    domain1 = INTERVALS(1)(10)
    c0 = BEZIER(S1)(b_generators)
    curve0 = MAP(c0)(domain1)
    return curve0

def profile_lateral(x,y,z):
    points_1 = POLYLINE([[2.40,1.15,0],[1.15,1.15,0],[1,1,0],[2.6,1,0],[2.6,1.66,0]])
    control_1 = [[2.40,1.15,0],[2.6,1.15,0],[2.6,1.66,0]]
    curve_1 = make_bezier_line(control_1)
    
    control_2_1 = [[2.6,1.66,0],[2.6,3.46,0],[5.35,3.46,0],[5.35,1.66,0]]
    curve_2_1 = make_bezier_line(control_2_1)
    control_2_2 = [[2.6,1.66,0],[2.6,3.6,0],[5.35,3.6,0],[5.35,1.66,0]]
    curve_2_2 = make_bezier_line(control_2_2)
    curve_2 = STRUCT([curve_2_1,curve_2_2])
    
    points_2 = POLYLINE([[5.35,1.66,0],[5.35,1,0],[11.61,1,0],[11.61,1.36,0],[5.35,1.36,0]])
    points_3 = POLYLINE([[11.61,1.66,0],[11.61,1.36,0]])
    
    control_3_1 = [[11.61,1.66,0],[11.61,3.46,0],[14.36,3.46,0],[14.36,1.66,0]]
    curve_3_1 = make_bezier_line(control_3_1)
    control_3_2 = [[11.61,1.66,0],[11.61,3.6,0],[14.36,3.6,0],[14.36,1.66,0]]
    curve_3_2 = make_bezier_line(control_3_2)
    curve_3 = STRUCT([curve_3_1,curve_3_2])
    
    points_4 = POLYLINE([[14.36,1.66,0],[14.36,1.16,0],[16.12,1.46,0],[16.5,1.82,0],[16.71,2.77,0],[16.42,3,0],[16.22,3,0]])
    control_4 = [[16.22,3,0],[16.22,4.15,0],[16.1,4.15,0]]
    curve_4 = make_bezier_line(control_4)
    
    points_5 = POLYLINE([[16.1,4.15,0],[16.53,4.37,0],[16.43,4.47,0],[15.83,4.27,0]])
    control_6 = [[15.83,4.27,0],[14.55,4.27,0],[14.55,4.47,0]]
    curve_6 = make_bezier_line(control_6)
    
    control_7 = [[14.55,4.47,0],[12.55,5.07,0],[10.55,5.4,0],[8,5.27,0],[7,5.17,0],[6,3.69,0]]
    curve_7 = make_bezier_line(control_7)
    
    control_8 = [[6,3.69,0],[6,3.89,0],[5.58,3.89,0]]
    curve_8 = make_bezier_line(control_8)
    
    control_9 = [[5.58,3.89,0],[3.58,3.8,0],[2.58,3.6,0],[1.3,3.5,0],[1.3,3.1,0]]
    curve_9 = make_bezier_line(control_9)
    points_6 = POLYLINE([[1.3,3.10,0],[1.4,3,0]])
    
    control_10 = [[1.4,3,0],[1.4,2.4,0],[1.5,2.25,0],[1.6,2.4,0]]
    curve_10 = make_bezier_line(control_10)
    
    points_7 = POLYLINE([[1.6,2.4,0],[1.25,2.3,0]])
    
    control_11 = [[1.25,2.3,0],[1,2.2,0],[1,2.1,0],[1,1.8,0]]
    curve_11 = make_bezier_line(control_11)
    
    control_12 = [[1,1.8,0],[1,1.75,0],[1.5,1.75,0]]
    curve_12 = make_bezier_line(control_12)
    
    points_8 = POLYLINE([[1.5,1.75,0],[1.5,1.3,0],[1.4,1.3,0],[1.4,1.15,0]])
    
    str_curves = STRUCT([points_1,points_2,points_3,points_4,points_5,points_6,points_7,points_8])
    str_polyli = STRUCT([curve_1,curve_2,curve_3,curve_4,curve_6,curve_7,curve_8,curve_9,curve_10,curve_11,curve_12])
    
    total_struct = T([1,2,3])([x,y,z])(STRUCT([str_curves,str_polyli]))
    
    return total_struct

def profile_up(x,y,z):
    control_1 = [[0,0,0],[0,0,3],[3,0,3]]
    curve_1 = make_bezier_line(control_1)
    
    control_2 = [[3,0,3],[5.35,0,3],[5.35,0,2.7]]
    curve_2 = make_bezier_line(control_2)
    
    control_3 = [[5.35,0,2.7],[10,0,2.9],[10,0,2.85]]
    curve_3 = make_bezier_line(control_3)
    
    control_4 = [[10,0,2.85],[11,0,3.1]]
    curve_4 = make_bezier_line(control_4)
    
    point_1 = POLYLINE([[11,0,3.1],[13,0,3.1]])
    
    control_5 = [[13,0,3.1],[13.5,0,3.1],[13.5,0,2.9]]
    curve_5 = make_bezier_line(control_5)
    
    control_6 = [[13.5,0,2.9],[15.20,0,2.9],[15.20,0,2.6]]
    curve_6 = make_bezier_line(control_6)
    
    control_7 = [[15.20,0,2.6],[15.9,0,2.6],[15.9,0,0]]
    curve_7 = make_bezier_line(control_7)
    
    struttura_1 = STRUCT([curve_1,curve_2,curve_3,curve_4,point_1,curve_5,curve_6,curve_7])
    struttura_2 = R([2,3])(PI)(struttura_1)
    
    struttura = T([1,2,3])([x,y,z])(STRUCT([struttura_1,struttura_2]))
    return struttura
    
def profile_front(x,y,z):
    point_1 = POLYLINE([[0,0,0],[0,0,2.675],[0,0.1,2.775],[0,1.76,3]])
    
    control_1 = [[0,1.76,3],[0,1.9,3],[0,1.9,2.8]]
    curve_1 = make_bezier_line(control_1)
    
    control_2 = [[0,1.9,2.8],[0,2.65,2.8],[0,2.65,2.4]]
    curve_2 = make_bezier_line(control_2)
    
    point_2 = POLYLINE([[0,2.65,2.4],[0,3.75,2.0]])    
    
    control_3 = [[0,3.75,2.0],[0,4.15,2.0],[0,4.15,0]]
    curve_3 = make_bezier_line(control_3)
    
    struttura_1 = STRUCT([point_1,curve_1,curve_2,point_2,curve_3])
    struttura_2 = R([1,3])(PI)(struttura_1)
    
    struttura = T([1,2,3])([x,y,z])(STRUCT([struttura_1,struttura_2]))
    return struttura

def profile_rear(x,y,z):
    point_1 = POLYLINE([[0,0.46,0],[0,0.46,2.675],[0,1.76,3]])
    
    control_1 = [[0,1.76,3],[0,2.1,3],[0,2.1,2.8]]
    curve_1 = make_bezier_line(control_1)
    
    control_2 = [[0,2.1,2.8],[0,2.45,2.8],[0,2.45,2.4]]
    curve_2 = make_bezier_line(control_2)
    
    point_2 = POLYLINE([[0,2.45,2.4],[0,3.35,2.0]])    
    
    control_3 = [[0,3.35,2.0],[0,3.65,2.0],[0,3.75,0]]
    curve_3 = make_bezier_line(control_3)
    
    struttura_1 = STRUCT([point_1,curve_1,curve_2,point_2,curve_3])
    struttura_2 = R([1,3])(PI)(struttura_1)
    
    struttura = T([1,2,3])([x,y,z])(STRUCT([struttura_1,struttura_2]))
    return struttura

def make_profile(x,y,z):
    prof_lateral_sx = profile_lateral(0,0,0)
    prof_lateral_dx = profile_lateral(0,0,6)
    prof_upper      = profile_up(1,1,3)
    prof_down       = profile_up(1,5.2,3)
    prof_front      = profile_front(1,1,3)
    prof_rear       = profile_rear(16.8,1,3)
    prof_struct = STRUCT([prof_lateral_sx,prof_lateral_dx,prof_upper,prof_down,prof_front,prof_rear])
    prof_centered = T([1,2,3])([x,y,z])(prof_struct)
    return prof_centered

profile = make_profile(-9,-3,-3)
VIEW(profile)

raw_input("Press enter to exit")
