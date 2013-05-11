#----------------------------------------------------------
#FULLY COMMENTED AND REFACTORED CODE IS HERE!!!------------
#-------------------------------------PACE GIOVANNI--------

from pyplasm import *
import scipy
from scipy import *

"""Utility for the declaration of the grids"""
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

"""Self declared utilities"""
#Used for tracing the Anulus Sector used in the rotating functions
def annulus_sector (alpha, r, R):
    dom_u = INTERVALS(alpha)(36)
    dom_v = INTERVALS(R-r)(1)
    dom = PROD([dom_u,dom_v])
    def mapping(v):
        a = v[0]
        r = v[1]
        return [r*COS(a), r*SIN(a)]
    model = MAP(mapping)(dom)
    return model

#Used for tracing the Taurus squared
def taurus_extruded(x,y,z,quote,int_r,ext_r):
    semicircle_0 = annulus_sector(2*PI, 0, int_r)
    semicircle_0 = PROD([semicircle_0,Q(quote)])
    semicircle_1 = annulus_sector(2*PI, 0, ext_r)
    semicircle_1 = PROD([semicircle_1,Q(quote)])
    annulus = DIFF([semicircle_1,semicircle_0])
    return T([1,2,3])([x,y,z])(annulus)

#Used for tracing a Bezier Tube
def bezier_tube_control(x,y,z,dx,dy,dz,sp):
    control_1 = [[z,x,y-1],[z,x-1,y-1],[z,x-1,y],[z,x-1,y+1],[z,x,y+1],[z,x+1,y+1],[z,x+1,y],[z,x+1,y-1],[z,x,y-1]]
    control_2 = [[z+sp,x,y-1-dy],[z+sp,x-1-dx,y-1-dy],[z+sp,x-1-dx,y],[z+sp,x-1-dx,y+1+dy],[z+sp,x,y+1+dy],[z+sp,x+1+dx,y+1+dy],[z+sp,x+1+dx,y],[z+sp,x+1+dx,y-1-dy],[z+sp,x,y-1-dy]]
    controlpoints = [control_1,control_2]
    return controlpoints

#Used for tracing the Bezier Surface
def make_bezier(b_generators):
    domain = GRID([14,14])
    mapping = BEZIERSURFACE(b_generators)
    element_in_3D = MAP(mapping)(domain)
    return element_in_3D

#Used for tracing the External Pry of the rim
def esternal_pry(r, R, dz, scale):
    modelToro = TORUS([r,R])([50,50])
    modelToro = S([3])([scale])(modelToro)
    modelToro = T([3])([dz])(modelToro)
    return modelToro

#Used for tracing the Bezier Line
def make_bezier_line(b_generators):
    domain1 = INTERVALS(1)(10)
    c0 = BEZIER(S1)(b_generators)
    curve0 = MAP(c0)(domain1)
    return curve0

"""
def radius_rim(alpha, r, R, num, prn):    
    rims = []
    i=0
    for i in range(num):
        rims.append(POLYLINE([[i,r,0],[i,R,0]]))    
    rim_coordinates = STRUCT(rims)
    
    def mapping(v):
        a = v[0]
        r = v[1]
        return [r*COS(a), r*SIN(a)]
    
    model = MAP(mapping)(rim_coordinates)
    
    pern = annulus_sector (2*PI, 0, 0.5)
    pern = PROD([pern,Q(0.25)])
    pern = T([3])([-0.125])(pern)
    
    pern_1 = annulus_sector (2*PI, 0, 0.125)
    pern_1 = PROD([pern_1,Q(prn)])
    pern_1 = T([3])([-prn/2])(pern_1)
    
    return STRUCT([model,pern,pern_1])

PROBLEM TRACING BEZIER WITH THIS FUNCTION!!!    
def controls_pry(alpha, r, R, num, prn):    
    rims = []
    i=0
    for i in range(num):
        rims.append(POLYLINE([[i,9.9,0],[i,12,-1],[i,13,1],[i,13,8],[i,13,9],[i,12,11],[i,9.9,10]]))    
    rim_coordinates = STRUCT(rims)
    
    def mapping(v):
        a = v[0]
        r = v[1]
        return [r*COS(a), r*SIN(a)]
    
    model = MAP(mapping)(rim_coordinates)
    
    return STRUCT([model])
"""

def profile_lateral(x,y,z):
    #Lateral profile made by tracing polylines and bezier. Is very hard, for this type of car, use only Bezier because is squared.
    points_1 = POLYLINE([[2.40,1.15,0],[1.15,1.15,0],[1,1,0],[2.6,1,0],[2.6,1.66,0]])
    control_1 = [[2.40,1.15,0],[2.6,1.15,0],[2.6,1.66,0]]
    curve_1 = make_bezier_line(control_1)

    #Mudguard front
    control_2_1 = [[2.6,1.66,0],[2.6,3.46,0],[5.35,3.46,0],[5.35,1.66,0]]
    curve_2_1 = make_bezier_line(control_2_1)
    control_2_2 = [[2.6,1.66,0],[2.6,3.6,0],[5.35,3.6,0],[5.35,1.66,0]]
    curve_2_2 = make_bezier_line(control_2_2)
    curve_2 = STRUCT([curve_2_1,curve_2_2])
    
    points_2 = POLYLINE([[5.35,1.66,0],[5.35,1,0],[11.61,1,0],[11.61,1.36,0],[5.35,1.36,0]])
    points_3 = POLYLINE([[11.61,1.66,0],[11.61,1.36,0]])

    #Mudguard rear
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

    #Union of all the structure of the profile
    str_curves = STRUCT([points_1,points_2,points_3,points_4,points_5,points_6,points_7,points_8])
    str_polyli = STRUCT([curve_1,curve_2,curve_3,curve_4,curve_6,curve_7,curve_8,curve_9,curve_10,curve_11,curve_12])

    #Utility for the changing of coordinates
    total_struct = T([1,2,3])([x,y,z])(STRUCT([str_curves,str_polyli]))
    
    return total_struct

def profile_up(x,y,z):
    #Upper profile tracing, used the same procedure.
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
    #Union of the alla the profile structures, for centering i use the traslation function on the end of the def.
    prof_lateral_sx = profile_lateral(0,0,0)
    prof_lateral_dx = profile_lateral(0,0,6)
    prof_upper      = profile_up(1,1,3)
    prof_down       = profile_up(1,5.2,3)
    prof_front      = profile_front(1,1,3)
    prof_rear       = profile_rear(16.8,1,3)
    prof_struct = STRUCT([prof_lateral_sx,prof_lateral_dx,prof_upper,prof_down,prof_front,prof_rear])
    prof_centered = T([1,2,3])([x,y,z])(prof_struct)
    return prof_centered

def wheel(dx,dy,dz):
    #Defining the structure of the rim
    e_2 = COLOR([0,0,1])(taurus_extruded(0,0,20,3,2.8,11))
    
    distance_c = 3
    c_points_internal_1 = [[distance_c,2,0],[distance_c,1,3],[9.5,0,0]]
    c_points_internal_2 = [[distance_c,2,0],[distance_c,2,4],[9.5,0,0]]
    c_points_internal_3 = [[distance_c,2,0],[distance_c,3,2],[9.5,0,0]]
    surface_1 = [c_points_internal_1,c_points_internal_2]
    surface_2 = [c_points_internal_2,c_points_internal_3]    
    surface_3 = [c_points_internal_1,c_points_internal_3]
    
    """
    Bezier Line Generators
    bez_internal_1 = make_bezier_line(c_points_internal_1)
    bez_internal_2 = make_bezier_line(c_points_internal_2)
    bez_internal_3 = make_bezier_line(c_points_internal_3)
    """
    
    #Defining spaces between the radius strings structure
    bez_internal_1_surface = make_bezier(surface_1)
    bez_internal_2_surface = make_bezier(surface_2)
    bez_internal_3_surface = make_bezier(surface_3)
    bez_internal = STRUCT([bez_internal_1_surface,bez_internal_2_surface,bez_internal_3_surface])

    #Defining spaces between the radius strings
    number = 24
    radius_wheels = COLOR([0,0,1])(T([3])([20])(STRUCT(NN(number)([bez_internal, R([1,2])(PI/12)]))))

    #Internal rings for deploy the structure
    e_0 = taurus_extruded(0,0,5,30,28,30.5)
    e_1 = COLOR([0,0,1])(taurus_extruded(0,0,20,5,26,28))
    
    torus = COLOR([0,0,0])(esternal_pry(30,36,20,6))    
    wheel_completed = STRUCT([e_0,e_1,e_2,radius_wheels,torus])
    
    return S([1,2,3])([dx,dy,dz])(wheel_completed)

def wheel_set():
    #Composing all the wheels on the structure.
    whe_1 = wheel(0.035,0.035,0.035)
    whe_1 = T([1,2,3])([4,-1.5,-3])(whe_1)

    whe_3 = wheel(0.035,0.035,0.035)
    whe_3 = T([1,2,3])([-5,-1.5,-3])(whe_3)

    whe_2 = wheel(0.035,0.035,0.035)
    whe_2 = R([1,2])(PI)(whe_2)
    whe_2 = T([1,2,3])([4,-1.5,1.65])(whe_2)

    whe_4 = wheel(0.035,0.035,0.035)
    whe_4 = R([1,2])(PI)(whe_4)
    whe_4 = T([1,2,3])([-5,-1.5,1.65])(whe_4)
    
    return STRUCT([whe_1,whe_2,whe_3,whe_4])

def wheel_steel():
    control_1 = [[0,1,0],[0,0,0],[ 0,0,1],[0,0,2],[0,1,2],[0,2,2],[0,2,1],[0,2,0],[0,1,0]]
    control_2 = [[7,1,0],[7,0,0],[ 7,0,1],[7,0,2],[7,1,2],[7,2,2],[7,2,1],[7,2,0],[7,1,0]]
    control_3 = [[8.5,1,0],[8,0,0],[ 8,0,1],[8,0,2],[8.5,1,2],[9,2,2],[9,2,1],[9,2,0],[8.5,1,0]]
    control_4 = [[10.5,0.5,0],[10,-0.5,0],[10,-0.5,1],[10,-0.5,2],[10.5,0.5,2],[11,1.5,2],[11,1.5,1],[11,1.5,0],[10,-0.5,0]]
    control_5 = [[11,-4,0],[11,-4,0],[11,-4,1],[11,-4,2],[11.5,-4,2],[13,-4,2],[13,-4,1],[13,-4,0],[11,-4,0]]
    control_6 = [[11,-6,0],[11,-6,0],[11,-6,1],[11,-6,2],[11.5,-6,2],[13,-6,2],[13,-6,1],[13,-6,0],[11,-6,0]]
    control_8 = [[11,-8,0],[11,-8,0],[11,-8,1],[11,-8,2],[11.5,-8.125,2],[13,-8.5,2],[13,-8.5,1],[13,-8.5,0],[11,-8,0]]
    control_9 = [[10,-10,0],[10,-10,0],[10,-10,1],[10,-10,2],[10.5,-10.125,2],[12,-10.5,2],[12,-10.5,1],[12,-10.5,0],[10,-10,0]]
    control_10 = [[6,-15,0],[6,-15,0],[6,-15,1],[6,-15,2],[6.5,-15.25,2],[8,-16,2],[8,-16,1],[8,-16,0],[6,-15,0]]
    control_11 = [[0,-14,0],[0,-14,0],[0,-14,1],[0,-14,2],[0,-14,2],[0,-16,2],[0,-16,1],[0,-16,0],[0,-14,0]]
    
    control_7 = [[11,-4,0],[11,-2,0],[11,-2,1],[11,-2,2],[11,-4,2],[11,-8,2],[11,-8,1],[11,-8,0],[11,-4,0]]
    control_12 = [[8,-4,0],[8,-4,0],[8,-4,1],[8,-4,2],[8,-4,2],[8,-6,2],[8,-6,1],[8,-6,0],[8,-4,0]]
    control_13 = [[6,-4,0],[6,-4,0],[6,-4,1],[6,-4,2],[6,-4,2],[6,-3,2],[6,-6,1],[6,-6,0],[6,-4,0]]
    
    
    controlpoints_1 = [control_1,control_2,control_3,control_4,control_5,control_6,control_8,control_9,control_10,control_11]
    controlpoints_2 = [control_7,control_12,control_13]
    """
    c_1 = POLYLINE(control_1)
    c_2 = POLYLINE(control_2)
    c_3 = POLYLINE(control_3)
    c_4 = POLYLINE(control_4)
    c_5 = POLYLINE(control_5)
    c_6 = POLYLINE(control_6)
    c_8 = POLYLINE(control_8)
    c_9 = POLYLINE(control_9)
    c_10 = POLYLINE(control_10)
    c_11 = POLYLINE(control_11)
    
    c_7 = POLYLINE(control_7)
    c_12 = POLYLINE(control_12)
    c_13 = POLYLINE(control_13)
    """
    control_1_t = [[ 0,0,0],[0,0,1.6],[0,1.6,1.6],[0,1.6,0]]
    control_2_t = [[ 6,0,0],[6,0,1.6],[6,1.6,1.6],[6,1.6,0]]
    controlpoints_t = [control_1_t,control_2_t]
    
    b_1 = make_bezier(controlpoints_t)
    b_1 = R([2,3])(PI/2)(b_1)
    b_1 = T([2])([-12])(b_1)
    
    #Function used because is impossible to extrude the bezierfunction (i don'e know why), and so i have engined this.
    bez_c_1 = [[1.5,1,0],[1.5,-3.5,0],[6,-4,0]]
    bez_c_1_1 = [[1.5,1,1.6],[1.5,-3.5,1.6],[6,-4,1.6]]
    bez_c_2 = [[0,1,0],[0,-4.5,0],[0,-4.5,0]]
    bez = [bez_c_1,bez_c_2]
    bez_1 = [bez_c_1,bez_c_1_1]
    
    bezier_1 = make_bezier(bez_1)

    bez_rap = make_bezier(bez)
    bez_rap = T([3])([0])(bez_rap)
    bez_rap_1 = T([3])([4.75])(bez_rap)
    
    a = make_bezier(controlpoints_1)
    b = make_bezier(controlpoints_2)

    #I made only one profile and mirror it on the plan
    
    total_1 = STRUCT([a,b,bezier_1,bez_rap_1,bez_rap,b_1])
    total_2 = R([3,1])(PI)(total_1)
    total_2 = T([3])([5])(total_2)
    
    total = STRUCT([total_1,total_2])
    total = S([1,2,3])([0.02,0.02,0.02])(total)
    total = R([1,2])(PI)(total)
    total = R([1,3])(PI/2)(total)
    total = T([1,3])([-2.4,2])(total)
    return total

def surface_two(x,y,z):
    #First surface of the lateral door of the car.
    controls_1 =[[0.24,-0.48,0],[0.22,-0.44,0],[0.22,-0.41,0],[0.24,-0.41,0]]
    controls_2 =[[0.34,-0.48,0],[0.35,-0.48,0],[0.36,-0.44,0],[0.35,-0.41,0]]

    curve_1 = [controls_1,controls_2]
    curve_1_1 = make_bezier(curve_1)
    curve_1_1 = S([1,2,3])([35,35,35])(curve_1_1)
    
    upper = STRUCT([curve_1_1])
    upper = S([1,2,3])([0.33,0.33,0.33])(upper)
    upper = T([1,2,3])([x,y,z])(upper)
    curves = COLOR([0,0,1])(STRUCT([upper]))

    return curves

def surface_one(x,y,z):
    #Upper surface of the car made by tracing 2 lateral strips (control_1 and control_2) and a central surface (control_3).
    control_1_1 = [[6,3.69,0.5],[7,5.17,0.5],[8,5.27,0.3],[10.55,5.4,0.5],[12.55,5.07,0.7],[14.55,4.47,0.7]]
    control_1_2 = [[6,3.69,0.8],[7,5.17,0.8],[8,5.27,0.6],[10.55,5.4,0.8],[12.55,5.07,1],[14.55,4.47,1]]
    control_2_1 = [[6,3.69,5.2],[7,5.17,5.2],[8,5.27,5.4],[10.55,5.4,5.2],[12.55,5.07,5],[14.55,4.47,5]]
    control_2_2 = [[6,3.69,5.5],[7,5.17,5.5],[8,5.27,5.7],[10.55,5.4,5.5],[12.55,5.07,5.3],[14.55,4.47,5.3]]

    control_3_1 = [[7,4.6,0.8],[7,4.8,0.7],[8,5.20,0.6],[10.55,5.4,0.8],[12.55,4.95,0.7]]
    control_3_2 = [[7,4.6,5.2],[7,4.8,5.3],[8,5.20,5.4],[10.55,5.4,5.2],[12.55,4.95,5.3]]

    curve_1_1 = make_bezier_line(control_1_1)
    curve_1_2 = make_bezier_line(control_1_2)
    curve_2_1 = make_bezier_line(control_2_1)
    curve_2_2 = make_bezier_line(control_2_2)
    curve_1 = [control_1_1,control_1_2]
    curve_2 = [control_2_1,control_2_2]
    curve_3 = [control_3_1,control_3_2]

    upper = STRUCT([make_bezier(curve_1),make_bezier(curve_2),make_bezier(curve_3)])
    upper = S([1,2,3])([0.33,0.33,0.33])(upper)
    upper = T([1,2,3])([x,y,z])(upper)
    curves = COLOR([0,0,1])(STRUCT([upper]))

    return curves


#CALL OF THE MAIN FUNCTIONS
whe_steel = wheel_steel()
profile = make_profile(-9,-3,-3)
wheel_set = wheel_set()
surface_1 = surface_one(-9,-3,-3)
surface_2 = surface_two(-10.6,14.6,-2.7)

VIEW(STRUCT([surface_1,profile,surface_2,whe_steel,wheel_set]))

raw_input("Press enter to exit")
