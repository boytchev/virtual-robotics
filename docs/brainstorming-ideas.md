<img src="images/closed-source.png" width="500">

# Brainstorming Ideas


#### Contents
* **Brainstorming Ideas**<small><br>
	&ndash; [Topology](#topology)<br>
	&ndash; [Sensors and feedback](#sensors-and-feedback)<br>
	&ndash; [Interface](#interface)<br>
	&ndash; [Visual](#visual)<br>
	&ndash; [Postures](#postures)<br>
	&ndash; [Documents](#documents)<br>
	&ndash; [Initially needed information](#initially-needed-information)</small>
* **Other Ideas**<small><br>
	&ndash; [Grip lock](#grip-lock)<br>
	&ndash; [Grasp taxonomy](#grasp-taxonomy)<br>
	&ndash; [Shoulder control](#shoulder-control)<br>
	&ndash; [Automatic grip](#automatic-grip)</small>
* **References**<small><br>
	&ndash; [Grasp reference](#grasp-reference)<br>
	&ndash; [Detailed hand](#detailed-hand)</small>


## Brainstorming Ideas

#### Topology
* <span style="background:palegreen">T1. [**DONE**] Custom skeleton (e.g. model 1 individual finger, or a hand with 6 fingers)</span>
* <span style="background:palegreen">T2. [**DONE**] Custom shapes (e.g. different 3D shapes of body parts)</span>
* <span style="background:palegreen">T3. [**DONE**] Custom degrees of freedom in joints</span>
* <span style="background:palegreen">T4. [**DONE**] Custom ranges of joint rotations</span>
* T5. Inverse kinematics
* T6. Soft tissue and deformations
* T7. Dependant motors (they retrieve orientation from another motor)

#### Sensors and feedback
* <span style="background:palegreen">S1. [**DONE**] Custom positions of sensors</span>
* <span style="background:palegreen">S2. [**DONE**] Feedback from joint positions</span>
* <span style="background:palegreen">S3. [**DONE**] Collision detection with external objects</span>
* <span style="background:palegreen">S4. [**DONE**] Self-collision detection</span>
* <span style="background:palegreen">S5. [**DONE**] Visual feedback with color heatmaps</span>
* <span style="background:palegreen">S6. [**DONE**] Visual feedback with vectors</span>
* S7. Visual feedback with tables/graphs
* S8. Gravity for gripped objects
* <span style="background:palegreen">S9. [**DONE**] Velocity sensor</span>
* <span style="background:palegreen">S10. [**DONE**] Accelleration sensor</span>
* <span style="background:palegreen">S11. [**DONE**] Temperature sensor</span>

#### Interface
* I1. Interface API for using from outside
* <span style="background:palegreen">I2. [**DONE**] Programming control via API</span>
* <span style="background:palegreen">I3. [**DONE**] API for model definition</span>
* <span style="background:palegreen">I4. [**DONE**] API for model motion</span>

#### Visual
* <span style="background:palegreen">V1. [**DONE**] Interactive controls</span>
* V2. Stock objects to grap and hold
* <span style="background:palegreen">V3. [**DONE**] Importing GLTF body parts</span>
* V4. Exporting GLTF models
* V5. Customs warning (aka virtual pain)
* <span style="background:palegreen">V6. [**DONE**] VR mode (with VR headsets)</span>

#### Postures
* P1. Mapping between input data and posture
* <span style="background:palegreen">P2. [**DONE**] Predefined collection of postures</span>
* P3. Predefined animations
* <span style="background:palegreen">P4. [**DONE**] Scenes with several models</span>
* P5. Self-balancing of pressure
* <span style="background:palegreen">P6. [**DONE**] Predefined models (e.g. hands)</span>
* P7. Self-learning mode
* P8. Macros mode (e.g. grip for rod, ball, cup; handshake, ...)

#### Documents
* <span style="background:palegreen">D1. [**DONE**] GitHub project</span>
* <span style="background:palegreen">D2. [**DONE**] User documentation</span>
* D3. Educational content
* D4. Academic papers
* <span style="background:palegreen">D5. [**DONE**] Social network disseminations (e.g. videos)</span>



## References

#### Grasp reference

A Sketchpad model of a human head making the sign language gestures for all
letters and digits is available at [Male Hands Alphabet Numbers](https://sketchfab.com/3d-models/male-hands-alphabet-numbers-a2ef72dee3b34a238910cae60816dc71).
It can be used as a reference so that to verify whether all these gestures can
be made with the virtual hand.

[<img src="images/male-hands-alphabet-numbers.jpg">](https://sketchfab.com/3d-models/male-hands-alphabet-numbers-a2ef72dee3b34a238910cae60816dc71)

Additionally, The Japanese Sigh Language has a larger set of fingerspelling
gestures, shown in [Practice JSL Fingerspelling](https://www.kyoto-be.ne.jp/ed-center/gakko/jsl/zen_jsl04.htm)
or in [Japanese manual syllabary](https://en.wikipedia.org/wiki/Japanese_manual_syllabary)

<img src="images/JSL-fingerspelling.jpg">


#### Detailed hand

A Sketchpad model is a detailed 3D model of robotic hand. The license
is CC-BY, so it is possible to download it and test whether Virtual Robotics
can use this model. The model is [jointed hands BJD](https://sketchfab.com/3d-models/jointed-hands-bjd-25da42bebf7b4f70994e9f8f0e9fe1c5).

[<img src="images/jointed-hands-bjd.jpg">](https://sketchfab.com/3d-models/jointed-hands-bjd-25da42bebf7b4f70994e9f8f0e9fe1c5)


