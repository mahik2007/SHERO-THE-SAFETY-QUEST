import { Mission, SupportResource } from './types';

export const MISSIONS: Mission[] = [
  {
    id: 'mission-1',
    number: 1,
    title: 'The Last Bus',
    tagline: 'Dusk falls over the transit hub, and an unexpected stranger closes the distance.',
    domain: 'Public Transport & Commute Safety',
    environmentName: 'City Bus Stop at Dusk',
    badgeName: 'COMMUTE GUARDIAN',
    badgeIcon: 'ShieldCheck',
    badgeDescription: 'Mastered commute situational awareness and safe transit navigation.',
    difficulty: 'Beginner',
    summary: 'Aira waits for her evening bus when a stranger persistently approaches and violates personal space.',
    learningGoal: 'Recognize boundary testing early, shift to illuminated staffed zones, and verify arrival protocols.',
    startNodeId: 'm1_node_1',
    nodes: {
      m1_node_1: {
        id: 'm1_node_1',
        decisionNumber: 1,
        situation: 'Dusk has settled. Aira stands near a dimly lit edge of the bus shelter. A stranger steps closer, ignoring her clear physical step back and asking invasive questions about where she lives.',
        speaker: 'Stranger',
        dialogue: '"Hey, you\'re waiting alone? I can drop you home. Come sit over here by the shadows."',
        heroResponseDialogue: '"No, thank you. I\'m okay waiting here, and I\'m calling someone I trust."',
        strangerType: 'cap_hoodie',
        airaThought: 'He keeps stepping closer even though I deliberately shifted away. Waiting in this dark corner alone feels unsafe.',
        choices: [
          {
            id: 'm1_c1_a',
            text: 'Ignore him silently and put on noise-cancelling headphones while staying in the dark corner.',
            isCorrect: false,
            feedback: 'Blocking your hearing and remaining isolated in a dim area eliminates situational awareness and leaves you vulnerable.',
            educationalTip: 'Never block your auditory senses when dealing with suspicious individuals in low-visibility transit points.'
          },
          {
            id: 'm1_c1_b',
            text: 'Move immediately towards the brightly lit convenience store with cashier staff and waiting commuters.',
            isCorrect: true,
            feedback: 'Excellent choice! Moving promptly toward a well-lit space with active staff and other pedestrians deters unwanted contact.',
            educationalTip: 'Distance and public visibility are your strongest first-line defenses in transit environments.'
          },
          {
            id: 'm1_c1_c',
            text: 'Confront him aggressively with insults and demand to know why he is looking at you.',
            isCorrect: false,
            feedback: 'Escalating hostile language with an unknown person when alone in an isolated spot risks triggering physical aggression.',
            educationalTip: 'De-escalate or disengage toward populated areas rather than engaging in aggressive verbal confrontations alone.'
          }
        ],
        winningNextNodeId: 'm1_node_2'
      },
      m1_node_2: {
        id: 'm1_node_2',
        decisionNumber: 2,
        situation: 'Aira is now standing just outside the brightly lit 24/7 store. The stranger lingered near the shelter bench looking over. Aira has 8 minutes before the scheduled bus.',
        speaker: 'Convenience Store Clerk',
        dialogue: '"Good evening! Welcome. Feel free to wait by the window counter if you\'re waiting for the 42 line."',
        heroResponseDialogue: '"Thank you so much! I\'ll stay right by the window where it\'s well lit."',
        strangerType: 'bearded',
        airaThought: 'I am in a safe visual spot now, but I need to make sure someone knows my commute status in real time.',
        choices: [
          {
            id: 'm1_c2_a',
            text: 'Send a quick live location share and transit update to a trusted family member or friend.',
            isCorrect: true,
            feedback: 'Smart action! Live location sharing and proactive check-ins provide an immediate safety tether without drawing unwanted attention.',
            educationalTip: 'Always keep at least one trusted contact informed of your route and estimated arrival when commuting late.'
          },
          {
            id: 'm1_c2_b',
            text: 'Post a public story on social media tagging your exact real-time coordinates asking if anyone is nearby.',
            isCorrect: false,
            feedback: 'Broadcasting your real-time vulnerability and exact location to public social networks compromises your digital and physical safety.',
            educationalTip: 'Never broadcast real-time locations to public feeds; use private, designated trusted contacts.'
          },
          {
            id: 'm1_c2_c',
            text: 'Step back out into the alley behind the bus shelter to hide until the bus headlights appear.',
            isCorrect: false,
            feedback: 'Retreating into an unlit, blind alley removes you from natural surveillance and limits your exit routes completely.',
            educationalTip: 'Stay in the open where store staff, cameras, and passerby pedestrians provide natural surveillance.'
          }
        ],
        winningNextNodeId: 'm1_node_3'
      },
      m1_node_3: {
        id: 'm1_node_3',
        decisionNumber: 3,
        situation: 'The bus pulls up to the curb. The stranger abruptly gets up from the bench and heads for the same rear door. The front door is open next to the driver.',
        speaker: 'Bus Driver',
        dialogue: '"Line 42 Downtown Express. Boarding now."',
        heroResponseDialogue: '"Understood! I\'m boarding right by the front door near the operator."',
        strangerType: 'bearded',
        airaThought: 'I see him heading deliberately for the quiet rear section. How should I board?',
        choices: [
          {
            id: 'm1_c3_a',
            text: 'Rush quickly to the upper deck back row where it is completely empty and dark.',
            isCorrect: false,
            feedback: 'Going to an isolated corner with zero visibility from transit staff leaves you trapped if followed upstairs.',
            educationalTip: 'When commuting late on public transit, avoid isolated rear corners or empty upper levels.'
          },
          {
            id: 'm1_c3_b',
            text: 'Board through the front door and take a seat in the illuminated front section near the driver.',
            isCorrect: true,
            feedback: 'Perfect decision! Sitting in the forward compartment within direct eye contact of the driver offers maximum deterrence and immediate assistance.',
            educationalTip: 'Bus operators are trained professionals equipped with emergency radios. Sitting near them ensures quick intervention.'
          },
          {
            id: 'm1_c3_c',
            text: 'Decide to skip this bus and start walking alone in the dark along the 6-mile highway route.',
            isCorrect: false,
            feedback: 'Abandoning scheduled transit to walk alone on an unlit highway dramatically increases pedestrian and assault risks.',
            educationalTip: 'Stay with populated transit options rather than taking hazardous long-distance isolated footpaths.'
          }
        ],
        winningNextNodeId: 'VICTORY'
      }
    },
    victoryEnding: {
      title: 'Safe Arrival Guaranteed',
      description: 'Aira boarded safely near the driver and maintained active contact with her trusted friend until she stepped off into her well-lit home neighborhood.',
      takeaway: 'Commute security relies on situational awareness: maintaining line-of-sight with staff, illuminated zones, and verified check-ins.'
    }
  },
  {
    id: 'mission-2',
    number: 2,
    title: 'The Shadowed Street',
    tagline: 'Footsteps echo on the pavement. Coincidence or calculated pursuit?',
    domain: 'Walking Alone & Urban Awareness',
    environmentName: 'Urban Sidewalk with Streetlights',
    badgeName: 'STREET SMART',
    badgeIcon: 'Compass',
    badgeDescription: 'Exhibited proactive pedestrian assessment and evasive safety planning.',
    difficulty: 'Beginner',
    summary: 'Aira senses someone pacing behind her on a quiet urban sidewalk and systematically confirms and counters the threat.',
    learningGoal: 'Use directional testing to identify trailing, avoid dead ends, and seek staffed open establishments.',
    startNodeId: 'm2_node_1',
    nodes: {
      m2_node_1: {
        id: 'm2_node_1',
        decisionNumber: 1,
        situation: 'Walking home through an urban corridor, Aira hears steady footsteps matching her cadence 20 meters behind. The street ahead splits into an illuminated commercial road and a dark residential alley.',
        speaker: 'Aira',
        dialogue: '"Those footsteps have maintained the exact same distance for three blocks."',
        airaThought: 'I shouldn\'t panic, but I must deliberately test if this person is truly following me without cornering myself.',
        choices: [
          {
            id: 'm2_c1_a',
            text: 'Cross the street at the pedestrian crossing and turn down the well-lit commercial avenue.',
            isCorrect: true,
            feedback: 'Ideal maneuver! Changing sides at an open crosswalk objectively tests whether you are being followed while maintaining visibility and escape paths.',
            educationalTip: 'Crossing the street or making deliberate route variations at illuminated intersections safely clarifies intent.'
          },
          {
            id: 'm2_c1_b',
            text: 'Cut into the dark residential alleyway and try to sprint in the dark in your heels.',
            isCorrect: false,
            feedback: 'Sprinting into a narrow, unlit alleyway removes witnesses and risks running into a dead end or tripping.',
            educationalTip: 'Never enter enclosed alleys or dead-ends when assessing potential pursuit.'
          },
          {
            id: 'm2_c1_c',
            text: 'Stop abruptly, pull out your wallet to show you have no cash, and turn around to plead.',
            isCorrect: false,
            feedback: 'Displaying personal items and pleading unprovoked signals extreme vulnerability and halts your momentum.',
            educationalTip: 'Keep moving purposefully toward safe points. Never halt in isolation to engage an unknown follower.'
          }
        ],
        winningNextNodeId: 'm2_node_2'
      },
      m2_node_2: {
        id: 'm2_node_2',
        decisionNumber: 2,
        situation: 'Aira crossed the street. The individual also crossed diagonally and accelerated their pace, confirming intentional tracking. A brightly lit open bistro and a pharmacy are 50 meters ahead.',
        speaker: 'Follower',
        dialogue: '"Hey miss! Stop for a second, I just want to ask you something!"',
        airaThought: 'He is definitely tracking me and closing in. I cannot allow him to trap me in the open sidewalk.',
        choices: [
          {
            id: 'm2_c2_a',
            text: 'Turn into the open bistro, inform the host desk calmly that someone is following you outside.',
            isCorrect: true,
            feedback: 'Brilliant decision! Public commercial venues with staff provide immediate safety, witnesses, and landline phone access.',
            educationalTip: 'When followed, enter any open business (restaurant, pharmacy, hotel lobby) and alert staff immediately.'
          },
          {
            id: 'm2_c2_b',
            text: 'Run straight to your apartment door and fumble with your keys in the dark porch.',
            isCorrect: false,
            feedback: 'Leading a pursuer to your private doorstep reveals your residence and traps you with your back turned searching for keys.',
            educationalTip: 'Never lead a follower directly to your home address where you can be pinned against your doorway.'
          },
          {
            id: 'm2_c2_c',
            text: 'Turn around to challenge him to a physical fight right there in the empty sidewalk.',
            isCorrect: false,
            feedback: 'Physical combat when unprovoked and outnumbered or outsized carries severe risks when safe indoor havens are right ahead.',
            educationalTip: 'Evasion to safety is always superior to high-risk physical confrontation when an exit exists.'
          }
        ],
        winningNextNodeId: 'm2_node_3'
      },
      m2_node_3: {
        id: 'm2_node_3',
        decisionNumber: 3,
        situation: 'Inside the bistro, the manager locks the front glass latch as the pursuer glares through the glass before slipping into the night. Aira is safe inside, but needs to get home.',
        speaker: 'Bistro Manager',
        dialogue: '"Take a seat and have some water. We have security cameras recording outside. How would you like us to assist you getting home?"',
        airaThought: 'I am safe here, but I must make a responsible exit plan.',
        choices: [
          {
            id: 'm2_c3_a',
            text: 'Thank them, wait 2 minutes, and try walking home through the same dark sidewalk again alone.',
            isCorrect: false,
            feedback: 'Leaving right away on foot risks running straight into an ambush if the individual is waiting nearby around the corner.',
            educationalTip: 'Do not resume walking alone immediately after a pursuit incident.'
          },
          {
            id: 'm2_c3_b',
            text: 'Coordinate with staff to call police/verified secure taxi and have a friend meet you at your doorstep.',
            isCorrect: true,
            feedback: 'Outstanding resolution! Having law enforcement or verified door-to-door transport with a known companion eliminates follow-up risk.',
            educationalTip: 'Close the loop by securing authorized door-to-door escort and reporting the incident with location details.'
          },
          {
            id: 'm2_c3_c',
            text: 'Accept a ride from an unidentified customer in the bar who overheard the commotion.',
            isCorrect: false,
            feedback: 'Accepting an unverified private ride from another stranger introduces an unvetted secondary hazard.',
            educationalTip: 'Rely on official verified transport, law enforcement, or established trusted contacts only.'
          }
        ],
        winningNextNodeId: 'VICTORY'
      }
    },
    victoryEnding: {
      title: 'Pursuit Defused and Documented',
      description: 'Aira safely reached home via verified transport while the bistro manager preserved CCTV footage for community security reporting.',
      takeaway: 'Never lead a follower home. Test direction, seek immediate populated shelter, and arrange verified door-to-door transit.'
    }
  },
  {
    id: 'mission-3',
    number: 3,
    title: 'The Wrong Ride',
    tagline: 'A vehicle idles at the curb. The driver gestures to enter. But details do not match.',
    domain: 'Taxi & Rideshare Verification',
    environmentName: 'Rideshare Pickup Area',
    badgeName: 'RIDE READY',
    badgeIcon: 'Car',
    badgeDescription: 'Exemplified strict vehicle verification and boundary assertion in transit.',
    difficulty: 'Intermediate',
    summary: 'Aira orders a rideshare after an evening event. A car arrives claiming to be her ride, but license plate and vehicle model do not match her app.',
    learningGoal: 'Execute the 4-point verification check (License, Make/Model, Driver Name, Destination) before opening doors.',
    startNodeId: 'm3_node_1',
    nodes: {
      m3_node_1: {
        id: 'm3_node_1',
        decisionNumber: 1,
        situation: 'Aira is waiting at the designated curbside rideshare zone. Her app indicates a silver sedan with plate "MH-02-CW-4412". A dark SUV pulls up, rolls down its window, and the driver calls out.',
        speaker: 'Unmatched Driver',
        dialogue: '"Hey! Are you Aira? Get in, I\'m here for your app ride, hurry up before the traffic warden comes!"',
        airaThought: 'The app shows a silver sedan with plate 4412. This car is a dark SUV with plate 8809. He knows my first name because he shouted it or heard me talking.',
        choices: [
          {
            id: 'm3_c1_a',
            text: 'Jump into the backseat immediately since it is cold and he called out your first name.',
            isCorrect: false,
            feedback: 'Entering an unverified vehicle whose license plate and model contradict your booking poses grave kidnapping and robbery risks.',
            educationalTip: 'Never enter a vehicle that fails the license plate and vehicle model verification match.'
          },
          {
            id: 'm3_c1_b',
            text: 'Stand back on the sidewalk, keep doors closed, and check your app to verify driver name and license plate.',
            isCorrect: true,
            feedback: 'Spot on! Never approach or touch car handles until license plate, car make, and driver match the official app confirmation.',
            educationalTip: 'Always check: 1. License plate, 2. Car model & color, 3. Driver identity match before stepping off the curb.'
          },
          {
            id: 'm3_c1_c',
            text: 'Hand your phone through his open window so he can inspect your app screen.',
            isCorrect: false,
            feedback: 'Handing your phone to a stranger leaves you without communications, map tracking, or emergency calling capability.',
            educationalTip: 'Keep your mobile device securely in your hand at all times during transit check-ins.'
          }
        ],
        winningNextNodeId: 'm3_node_2'
      },
      m3_node_2: {
        id: 'm3_node_2',
        decisionNumber: 2,
        situation: 'Aira steps back onto the raised pedestrian curb. The driver persists, becoming irritated and unlocking the passenger door.',
        speaker: 'Unmatched Driver',
        dialogue: '"Come on, my other car broke down so the company gave me this one today! Ask my name if you don\'t believe me!"',
        airaThought: 'He wants me to ask who he is, but asking "Are you [Name]?" lets anyone say "Yes".',
        choices: [
          {
            id: 'm3_c2_a',
            text: 'Ask open-endedly: "What is my name and who are you picking up?" while staying safely on the curb.',
            isCorrect: true,
            feedback: 'Crucial technique! Never ask "Are you Alex?". Always ask "What is my name?" and "Who is your assigned passenger?".',
            educationalTip: 'Make the driver say your name and their own name first. An authorized driver has your name on their dashboard app.'
          },
          {
            id: 'm3_c2_b',
            text: 'Ask: "Are you Alex driving for Uber?" and hop in once he says yes.',
            isCorrect: false,
            feedback: 'Asking leading yes/no questions gives an impostor driver the exact name to confirm falsely.',
            educationalTip: 'Never provide the driver name or passenger name in your question. Keep the query strictly open-ended.'
          },
          {
            id: 'm3_c2_c',
            text: 'Get into the front passenger seat so you can reach the steering wheel if something goes wrong.',
            isCorrect: false,
            feedback: 'Sitting in the front seat places you in direct reach of the driver with zero buffer distance.',
            educationalTip: 'When using verified rides, always sit in the rear seat opposite the driver for safety and dual exit access.'
          }
        ],
        winningNextNodeId: 'm3_node_3'
      },
      m3_node_3: {
        id: 'm3_node_3',
        decisionNumber: 3,
        situation: 'The driver fails to state the name on the account, curses under his breath, and speeds off. Meanwhile, the actual silver sedan with plate MH-02-CW-4412 pulls up to the verified bay. The driver matches the app photo.',
        speaker: 'Verified Driver',
        dialogue: '"Hello Aira, I am Suresh. I have your trip to Green Avenue on my navigation."',
        airaThought: 'The vehicle and driver match. Now I should take my seat and enact standard ride safety protocol.',
        choices: [
          {
            id: 'm3_c3_a',
            text: 'Turn off your phone GPS to save battery and fall asleep for the entire 30-minute ride.',
            isCorrect: false,
            feedback: 'Sleeping and turning off GPS prevents you from tracking route deviations or sharing safety status.',
            educationalTip: 'Stay alert and monitor route progress using your own map application.'
          },
          {
            id: 'm3_c3_b',
            text: 'Enter the rear passenger seat, verify child-locks are disengaged, and activate in-app trip sharing with SafeCircle.',
            isCorrect: true,
            feedback: 'Exemplary rideshare safety! Sitting in the back opposite the driver, confirming door handles function, and sharing live trip progress ensures total security.',
            educationalTip: 'Always sit in the rear, test door latch freedom, and share live trip telemetry with your emergency circle.'
          },
          {
            id: 'm3_c3_c',
            text: 'Offer to transfer fare directly to his personal bank account outside the app platform to save taxes.',
            isCorrect: false,
            feedback: 'Taking transactions off-platform voids rideshare insurance, safety tracking, and emergency panic-button integration.',
            educationalTip: 'Keep all trip communications and payments strictly inside the verified rideshare application.'
          }
        ],
        winningNextNodeId: 'VICTORY'
      }
    },
    victoryEnding: {
      title: 'Verified Transit Triumph',
      description: 'Aira averted an unauthorized vehicle encounter through disciplined verification protocols and arrived home safely with monitored telemetry.',
      takeaway: 'Never compromise on the 4-point verification check: license plate, vehicle model, open-ended name inquiry, and in-app trip sharing.'
    }
  },
  {
    id: 'mission-4',
    number: 4,
    title: 'The Party Exit',
    tagline: 'Loud music, crowded rooms, and someone who refuses to accept "No".',
    domain: 'Social Boundaries, Consent & Peer Support',
    environmentName: 'Social Gathering with Visible Exits',
    badgeName: 'BOUNDARY BOSS',
    badgeIcon: 'Users',
    badgeDescription: 'Asserted firm personal boundaries and mobilized collaborative peer interventions.',
    difficulty: 'Intermediate',
    summary: 'At a campus party, an acquaintance tries to coerce Aira into drinking an open drink and isolating herself in an upstairs bedroom.',
    learningGoal: 'Enforce unequivocal boundary language, protect unattended drinks, and utilize ally-wing strategies.',
    startNodeId: 'm4_node_1',
    nodes: {
      m4_node_1: {
        id: 'm4_node_1',
        decisionNumber: 1,
        situation: 'Aira is chatting with classmates in a busy room. An acquaintance named Kyle hands her an open, poured plastic cup from a back room and stands blocking her path toward the patio.',
        speaker: 'Kyle',
        dialogue: '"Drink this, Aira! I mixed it specially for you upstairs. Don\'t be boring, everyone is having fun."',
        airaThought: 'I didn\'t see this cup poured. His stance is physically cornering me, and he\'s pressuring me to consume something unverified.',
        choices: [
          {
            id: 'm4_c1_a',
            text: 'Politely pretend to sip it and keep holding the cup to avoid hurting his feelings.',
            isCorrect: false,
            feedback: 'Holding or pretending to drink an unvetted open beverage risks accidental ingestion or drug tampering.',
            educationalTip: 'Never accept or consume an unsealed drink that was poured out of your direct line of sight.'
          },
          {
            id: 'm4_c1_b',
            text: 'State clearly and firmly: "No thank you, I only drink what I pour myself," and step sideways into the open room.',
            isCorrect: true,
            feedback: 'Clear, assertive, and unambiguous! Setting firm boundaries without apology preserves your personal agency and physical space.',
            educationalTip: 'Direct, clear "No" statements combined with shifting your physical stance away from corners prevent coercion.'
          },
          {
            id: 'm4_c1_c',
            text: 'Apologize profusely and tell him you will drink five cups later if he lets you go right now.',
            isCorrect: false,
            feedback: 'Making false concessions reinforces the boundary violation and sets up escalated pressure later in the night.',
            educationalTip: 'Do not apologize or make promises you do not want to keep when asserting personal consent.'
          }
        ],
        winningNextNodeId: 'm4_node_2'
      },
      m4_node_2: {
        id: 'm4_node_2',
        decisionNumber: 2,
        situation: 'Kyle frowns and insists: "Just come upstairs to the quiet study room so we can talk properly without the music." Her friend Maya notices Aira\'s tense posture from across the food table.',
        speaker: 'Maya',
        dialogue: '"Hey Aira! Is everything okay? I was just heading outside for fresh air."',
        airaThought: 'Maya has provided a perfect bystander window. How do I leverage this ally intervention?',
        choices: [
          {
            id: 'm4_c2_a',
            text: 'Wave Maya away and tell her you have to go upstairs because Kyle asked nicely.',
            isCorrect: false,
            feedback: 'Dismissing an active ally intervention forces you into an isolated upstairs space with an aggressive boundary violator.',
            educationalTip: 'Always accept support from friends or bystanders when facing uncomfortable pressure.'
          },
          {
            id: 'm4_c2_b',
            text: 'Link arms with Maya immediately: "Yes, Maya! I was just looking for you. Let\'s go outside together now."',
            isCorrect: true,
            feedback: 'Outstanding collaboration! Joining your friend immediately breaks the physical isolation trap and defuses the encounter gracefully.',
            educationalTip: 'Using an ally or buddy system creates mutual physical protection in social environments.'
          },
          {
            id: 'm4_c2_c',
            text: 'Start screaming at both Maya and Kyle that you hate all parties and throw your phone at the wall.',
            isCorrect: false,
            feedback: 'Losing control and destroying your own lifeline creates panic and alienates your supportive friend.',
            educationalTip: 'Keep your composure, hold onto your phone, and move with your trusted peer.'
          }
        ],
        winningNextNodeId: 'm4_node_3'
      },
      m4_node_3: {
        id: 'm4_node_3',
        decisionNumber: 3,
        situation: 'Aira and Maya reach the front porch near the well-lit driveway. The music thumps behind them. Maya asks if Aira wants to stay or leave together.',
        speaker: 'Maya',
        dialogue: '"I\'m ready to leave whenever you are, Aira. My ride is parked right out front or we can book together."',
        airaThought: 'I feel uncomfortable staying here after that interaction. It\'s time to exit safely.',
        choices: [
          {
            id: 'm4_c3_a',
            text: 'Go back inside alone to find Kyle and explain in detail why his behavior was socially inappropriate.',
            isCorrect: false,
            feedback: 'Returning alone into an alcohol-fueled environment to lecture an aggressive person puts you back into harm\'s way.',
            educationalTip: 'Prioritize physical safety and departure over attempting to educate an intoxicated boundary violator in the moment.'
          },
          {
            id: 'm4_c3_b',
            text: 'Leave together with Maya via her verified transport, and notify the event host later via message about the behavior.',
            isCorrect: true,
            feedback: 'Superb closure! Leaving in tandem ensures immediate safety, and reporting the violation to the host afterward establishes accountability.',
            educationalTip: 'Always leave with your buddy group. Document and report boundary breaches to organizers once you are in a safe space.'
          },
          {
            id: 'm4_c3_c',
            text: 'Decide to walk alone into the nearby dark park to sober up before heading home.',
            isCorrect: false,
            feedback: 'Walking into an unlit secluded park late at night introduces severe new hazards.',
            educationalTip: 'Never wander alone into dark secluded parks after social events.'
          }
        ],
        winningNextNodeId: 'VICTORY'
      }
    },
    victoryEnding: {
      title: 'Autonomous Boundaries Enforced',
      description: 'Aira asserted strict physical autonomy, partnered seamlessly with an active ally, and safely exited the event with zero compromise.',
      takeaway: 'Never consume unmonitored beverages. Stand firm on your boundaries and leverage peer support to neutralize coercion.'
    }
  },
  {
    id: 'mission-5',
    number: 5,
    title: 'The Unknown Account',
    tagline: 'Direct messages ping in rapid succession. Demands, doxxing threats, and digital extortion.',
    domain: 'Digital Safety & Cyber Harassment',
    environmentName: 'Dark Digital UI & Cyber Shield Matrix',
    badgeName: 'DIGITAL DEFENDER',
    badgeIcon: 'Smartphone',
    badgeDescription: 'Excellence in digital footprint defense, cyber evidence preservation, and threat containment.',
    difficulty: 'Advanced',
    summary: 'Aira receives anonymous messages containing leaked private details and extortion demands threatening online defamation.',
    learningGoal: 'Preserve digital evidence without engaging, harden multi-factor security, and utilize official reporting portals.',
    startNodeId: 'm5_node_1',
    nodes: {
      m5_node_1: {
        id: 'm5_node_1',
        decisionNumber: 1,
        situation: 'Aira is studying on her tablet when an anonymous profile "@ghost_shadow_99" sends multiple direct messages displaying a partial snippet of her home address and demanding money or private photos.',
        speaker: 'Anonymous Blackmailer',
        dialogue: '"We know where you study and live, Aira. Send $500 or private selfies to this link in 10 minutes, or we blast your contacts with doctored photos."',
        airaThought: 'My heart is pounding. This is extortion and cyberbullying. If I give in, the demands will never stop.',
        choices: [
          {
            id: 'm5_c1_a',
            text: 'Comply immediately by clicking their link and sending a small payment to appease them.',
            isCorrect: false,
            feedback: 'Paying blackmailers or clicking unverified links confirms active compliance and prompts exponentially worse demands.',
            educationalTip: 'Never pay or negotiate with digital extortionists; extortionists will escalate once payment is made.'
          },
          {
            id: 'm5_c1_b',
            text: 'Do not click links or argue; systematically capture timestamped screenshots of messages, profile URLs, and headers.',
            isCorrect: true,
            feedback: 'Textbook response! Preserving raw timestamps, account handles, and message text establishes forensic evidence before accounts get deleted.',
            educationalTip: 'Capture complete screenshots showing timestamps, usernames, and full message threads before blocking.'
          },
          {
            id: 'm5_c1_c',
            text: 'Reply with emotional insults, curse words, and dare them to do their worst online.',
            isCorrect: false,
            feedback: 'Engaging emotionally provides harassment fodder, incites retaliation, and can muddy your own reporting documentation.',
            educationalTip: 'Do not feed cyber trolls or extorters with emotional responses. Evidence preservation must come first.'
          }
        ],
        winningNextNodeId: 'm5_node_2'
      },
      m5_node_2: {
        id: 'm5_node_2',
        decisionNumber: 2,
        situation: 'Screenshots with timestamps and URLs are securely saved. The harasser continues to spam alert notifications. Aira needs to protect her account infrastructure and prevent access.',
        speaker: 'Aira',
        dialogue: '"They might have gotten my password from an old database breach. I have to lock down my perimeter right now."',
        airaThought: 'I must immediately secure my active sessions and stop unauthorized access across my linked accounts.',
        choices: [
          {
            id: 'm5_c2_a',
            text: 'Activate Multi-Factor Authentication (MFA), terminate all other active sessions, and update master passwords to unique passphrases.',
            isCorrect: true,
            feedback: 'Ironclad security protocol! Terminating active remote sessions and enabling MFA stops credential stuffing dead in its tracks.',
            educationalTip: 'Multi-factor authentication (using an authenticator app) prevents unauthorized logins even if passwords are leaked.'
          },
          {
            id: 'm5_c2_b',
            text: 'Post your email and ask your online followers to message the hacker to ask him to stop.',
            isCorrect: false,
            feedback: 'Publicly exposing your email invites dozens of secondary scammers and phishers into your inbox.',
            educationalTip: 'Keep breach management private and technical; do not crowd-source vigilante messaging.'
          },
          {
            id: 'm5_c2_c',
            text: 'Change your profile photo to a cartoon and keep the identical 6-digit birthday password.',
            isCorrect: false,
            feedback: 'Superficial cosmetic profile changes do not patch compromised authentication credentials.',
            educationalTip: 'Always rotate compromised credentials into complex, unique passphrases with MFA enabled.'
          }
        ],
        winningNextNodeId: 'm5_node_3'
      },
      m5_node_3: {
        id: 'm5_node_3',
        decisionNumber: 3,
        situation: 'Her accounts are secured with MFA and all foreign sessions have been severed. The harasser is now locked out, but the threat of defamation remains.',
        speaker: 'Platform Security Portal',
        dialogue: '"Reporting Center: Select violation category: Impersonation, Non-Consensual Imagery / Extortion, Hate Speech."',
        airaThought: 'Now I must officially lodge this with platform safety and the national cybercrime portal.',
        choices: [
          {
            id: 'm5_c3_a',
            text: 'Delete your own account and throw your tablet into the trash can to pretend nothing happened.',
            isCorrect: false,
            feedback: 'Deleting your account destroys your forensic proof and does nothing to stop the harasser from targeting others.',
            educationalTip: 'Retain evidence and utilize formal reporting rather than destroying your own devices.'
          },
          {
            id: 'm5_c3_b',
            text: 'Block the user, submit an extortion report to platform trust & safety, and lodge a complaint on the National Cybercrime portal.',
            isCorrect: true,
            feedback: 'Masterful execution! Using official cyber reporting mechanisms (such as cybercrime.gov.in / 1930) initiates legal deterrence while platform blocks neutralize access.',
            educationalTip: 'Report cyber harassment directly to platform safety teams and official statutory cybercrime portals (e.g., dial 1930 in India).'
          },
          {
            id: 'm5_c3_c',
            text: 'Pay a shadowy online "white hat hacker" on Telegram $300 to illegally DDoS the perpetrator.',
            isCorrect: false,
            feedback: 'Hiring illicit third-party cyber actors is illegal, dangerous, and frequently a secondary scam.',
            educationalTip: 'Rely strictly on official law enforcement and authenticated platform grievance officers.'
          }
        ],
        winningNextNodeId: 'VICTORY'
      }
    },
    victoryEnding: {
      title: 'Digital Fortification Achieved',
      description: 'Aira neutralized digital extortion through methodical evidence preservation, account hardening with MFA, and formal cybercrime escalation.',
      takeaway: 'Never pay extortionists. Document evidence with timestamps, activate multi-factor authentication, and report to official cyber defense authorities.'
    }
  },
  {
    id: 'mission-6',
    number: 6,
    title: 'The Silent Corridor',
    tagline: 'Whispers in institutional halls. A repeat offender abuses authority and ignores boundaries.',
    domain: 'Workplace & Campus Harassment Redressal',
    environmentName: 'University Academic Corridor & Student Support Office',
    badgeName: 'COURAGE CHAMPION',
    badgeIcon: 'Award',
    badgeDescription: 'Exhibited institutional courage and systematic documentation of persistent misconduct.',
    difficulty: 'Advanced',
    summary: 'A lab teaching assistant repeatedly makes inappropriate personal advances, implies grading retaliation, and corners Aira in an empty faculty corridor.',
    learningGoal: 'Navigate formal institutional redressal, maintain chronological incident logs, and utilize Internal Complaints Committees (ICC).',
    startNodeId: 'm6_node_1',
    nodes: {
      m6_node_1: {
        id: 'm6_node_1',
        decisionNumber: 1,
        situation: 'After evening lab hours in an empty corridor, the teaching assistant blocks Aira from submitting her physical project folder, hinting that private dinners correlate with high grades.',
        speaker: 'Teaching Assistant',
        dialogue: '"Your project looks a bit borderline, Aira. But if you come have drinks with me at my private apartment tonight, I\'m sure we can make it an A+."',
        airaThought: 'This is clear academic quid pro quo harassment and abuse of power. I must handle this professionally and establish a firm record.',
        choices: [
          {
            id: 'm6_c1_a',
            text: 'Laugh nervously, agree to the dinner, and hope he gives you good marks without expecting anything.',
            isCorrect: false,
            feedback: 'Acceding to quid pro quo demands emboldens institutional abuse and escalates vulnerability.',
            educationalTip: 'Never accept academic or workplace favors in exchange for private personal concessions.'
          },
          {
            id: 'm6_c1_b',
            text: 'State firmly: "My academic work should be evaluated solely on merit. I do not attend private meetings with instructors," and step out to the public lobby.',
            isCorrect: true,
            feedback: 'Perfect professional response! Setting a documented, clear verbal refusal while removing yourself to a public space destroys any ambiguity.',
            educationalTip: 'State unequivocal boundaries regarding professional and academic relationships in clear, objective terms.'
          },
          {
            id: 'm6_c1_c',
            text: 'Drop out of university and rip up your degree transcripts on the floor.',
            isCorrect: false,
            feedback: 'Abandoning your education punishes yourself rather than holding the perpetrator accountable through established procedures.',
            educationalTip: 'Institutions have statutory committees specifically designed to protect students and employees from misconduct.'
          }
        ],
        winningNextNodeId: 'm6_node_2'
      },
      m6_node_2: {
        id: 'm6_node_2',
        decisionNumber: 2,
        situation: 'The TA sends an intimidating follow-up email marking her submission "Under Scrutiny for Attitude". Aira knows she must build a documented case.',
        speaker: 'Aira',
        dialogue: '"He is attempting retaliation using official email channels. Every piece of writing now serves as evidence."',
        airaThought: 'How should I structure my documentation to ensure the university review board has incontrovertible facts?',
        choices: [
          {
            id: 'm6_c2_a',
            text: 'Maintain an immutable chronological incident log recording date, time, witnesses, spoken words, and back up all emails and messages.',
            isCorrect: true,
            feedback: 'Flawless documentation strategy! Contemporaneous records with exact timestamps, witness names, and backed-up email headers form the foundation of successful grievance investigations.',
            educationalTip: 'Contemporaneous notes (written immediately after an incident) carry high evidentiary weight in formal hearings.'
          },
          {
            id: 'm6_c2_b',
            text: 'Rant anonymously on an unverified gossip forum with made-up exaggerations.',
            isCorrect: false,
            feedback: 'Unverified forum rumors can lead to defamation cross-complaints and undermine formal investigatory credibility.',
            educationalTip: 'Stick strictly to verified facts and preserve objective records for authorized grievance bodies.'
          },
          {
            id: 'm6_c2_c',
            text: 'Delete the intimidating emails because reading them makes you feel stressed.',
            isCorrect: false,
            feedback: 'Deleting paper trails destroys the evidence necessary to prove institutional retaliation.',
            educationalTip: 'Always archive and export copies of harassing communications to a secure personal storage drive.'
          }
        ],
        winningNextNodeId: 'm6_node_3'
      },
      m6_node_3: {
        id: 'm6_node_3',
        decisionNumber: 3,
        situation: 'Aira stands outside the Student Grievance & Internal Complaints Committee (ICC) office. Her evidence portfolio is compiled and ready.',
        speaker: 'ICC Counselor',
        dialogue: '"Hello Aira. This office handles confidential complaints under the Prevention of Sexual Harassment policy. How can we support you?"',
        airaThought: 'This is the moment to lodge the formal grievance with interim protection measures.',
        choices: [
          {
            id: 'm6_c3_a',
            text: 'Walk away without speaking because you assume nobody in authority ever cares.',
            isCorrect: false,
            feedback: 'Walking away leaves the perpetrator in power to target future students and retaliate unchecked against your marks.',
            educationalTip: 'Formal complaint mechanisms exist to provide legal protection, confidentiality, and neutral oversight.'
          },
          {
            id: 'm6_c3_b',
            text: 'Submit the formal written complaint with your evidence log and formally request an interim reassignment of your academic evaluator.',
            isCorrect: true,
            feedback: 'Exemplary resolution! Requesting an independent evaluator protects your academic grading while the formal committee conducts an impartial inquiry.',
            educationalTip: 'Under POSH and institutional policies, complainants have the right to request interim relief, such as an alternative neutral examiner.'
          },
          {
            id: 'm6_c3_c',
            text: 'Bribe another professor with cash to force the TA to apologize publicly.',
            isCorrect: false,
            feedback: 'Bribery is illegal and corrupts the integrity of your rightful grievance.',
            educationalTip: 'Follow formal statutory grievance channels rather than illicit shortcuts.'
          }
        ],
        winningNextNodeId: 'VICTORY'
      }
    },
    victoryEnding: {
      title: 'Institutional Justice Secured',
      description: 'Aira dismantled an abuse of power through disciplined evidence preservation and official ICC advocacy, securing neutral grading and safe campus corridors for all.',
      takeaway: 'Never endure harassment in silence. Maintain chronological incident records, request interim protection, and engage statutory redressal committees.'
    }
  },
  {
    id: 'mission-7',
    number: 7,
    title: 'The Moment That Matters',
    tagline: 'A distressed stranger in a public square. Can you step in safely without escalating harm?',
    domain: 'Active Bystander Intervention & Emergency Action',
    environmentName: 'Public Metro Plaza & Emergency Assistance Booth',
    badgeName: 'COMMUNITY PROTECTOR',
    badgeIcon: 'HeartHandshake',
    badgeDescription: 'Mastered the 5Ds of safe bystander intervention and community crisis de-escalation.',
    difficulty: 'Advanced',
    summary: 'In a bustling public metro square, Aira witnesses a distressed young person being aggressively cornered and intimidated by two hostile individuals.',
    learningGoal: 'Deploy the 5Ds of Bystander Intervention (Distract, Delegate, Document, Delay, Direct) with safety as priority.',
    startNodeId: 'm7_node_1',
    nodes: {
      m7_node_1: {
        id: 'm7_node_1',
        decisionNumber: 1,
        situation: 'At the central metro plaza, a high school student is cornered against a pillar by two aggressive individuals demanding their phone and backpack. The student looks terrified and on the verge of tears.',
        speaker: 'Agitator',
        dialogue: '"Hand over the bag kid, or we\'ll make sure you don\'t make it to your train!"',
        airaThought: 'I cannot just look away, but charging into two aggressive people alone could escalate into severe violence.',
        choices: [
          {
            id: 'm7_c1_a',
            text: 'Charge at both individuals blindly with your umbrella swinging wildly.',
            isCorrect: false,
            feedback: 'Solo violent physical escalation against multiple assailants puts both yourself and the victim at severe risk of physical harm.',
            educationalTip: 'Bystander safety principle: Never escalate to physical violence when de-escalation, distraction, or delegation are available.'
          },
          {
            id: 'm7_c1_b',
            text: 'Use the "Distract" technique: Walk nearby with your transit map and ask loudly: "Excuse me! Can someone tell me where Platform 3 is?"',
            isCorrect: true,
            feedback: 'Brilliant bystander tactic! Creating an innocent distraction interrupts the harassment cycle without direct confrontation, allowing the target a chance to disengage.',
            educationalTip: 'The "Distract" method breaks the aggressor’s focus by creating a non-threatening, public interruption.'
          },
          {
            id: 'm7_c1_c',
            text: 'Pull out your phone, take a selfie with them in the background, and laugh out loud.',
            isCorrect: false,
            feedback: 'Trivializing a traumatic assault with mockery can provoke the attackers into turning their hostility directly onto you.',
            educationalTip: 'Interventions should be purposeful and centered on de-escalation and victim safety.'
          }
        ],
        winningNextNodeId: 'm7_node_2'
      },
      m7_node_2: {
        id: 'm7_node_2',
        decisionNumber: 2,
        situation: 'The distraction gave the student a second to step back, but the agitators are still loitering aggressively. Visible 30 meters away are two uniformed transit security officers and an Emergency Help Point button.',
        speaker: 'Aira',
        dialogue: '"Hey there, come with me towards the station office. Let\'s check the board together."',
        airaThought: 'I need to enlist official support immediately using the "Delegate" method.',
        choices: [
          {
            id: 'm7_c2_a',
            text: 'Signal and alert the nearby transit security officers immediately and press the station Emergency Help intercom.',
            isCorrect: true,
            feedback: 'Outstanding Delegation! Involving trained security and activating monitored emergency infrastructure ensures rapid, professional intervention.',
            educationalTip: 'The "Delegate" technique summons people in positions of authority (security, drivers, managers) who have enforcement capabilities.'
          },
          {
            id: 'm7_c2_b',
            text: 'Tell the student to stay put while you challenge the agitators to a push-up contest.',
            isCorrect: false,
            feedback: 'Bizarre antics do not secure real help or ensure protection for the vulnerable target.',
            educationalTip: 'Focus on summoning real institutional or security support swiftly.'
          },
          {
            id: 'm7_c2_c',
            text: 'Run away completely and leave the student alone with the two individuals.',
            isCorrect: false,
            feedback: 'Abandoning a cornered person without even alerting security leaves them completely exposed to harm.',
            educationalTip: 'Even if you cannot intervene directly, always delegate by informing security or emergency operators.'
          }
        ],
        winningNextNodeId: 'm7_node_3'
      },
      m7_node_3: {
        id: 'm7_node_3',
        decisionNumber: 3,
        situation: 'Transit security arrives promptly, moving between the agitators and the student. The aggressors disperse under security surveillance. The student is shaking and sitting on the bench.',
        speaker: 'Distressed Student',
        dialogue: '"Thank you so much... I didn\'t know what to do, I was so scared they were going to hurt me..."',
        airaThought: 'The immediate threat is over. Now I must execute the "Delay" / "Check-in" technique with empathy and respect.',
        choices: [
          {
            id: 'm7_c3_a',
            text: 'Tell them they should have been stronger and lecture them on why they looked like an easy target.',
            isCorrect: false,
            feedback: 'Victim-blaming causes intense psychological harm and invalidates the survivor\'s rightful sense of safety.',
            educationalTip: 'Never blame the victim or imply their clothing, demeanor, or posture caused the harassment.'
          },
          {
            id: 'm7_c3_b',
            text: 'Sit with them, validate their feelings ("You are safe now, that wasn\'t your fault"), offer water, and assist in contacting their parents or trusted guardian.',
            isCorrect: true,
            feedback: 'Heartwarming and trauma-informed! Supporting the survivor afterwards with validation, hydration, and safe guardian connection completes the 5D intervention cycle.',
            educationalTip: 'The "Delay / Check-In" phase provides trauma-informed reassurance, affirms dignity, and helps reconnect the individual with their support network.'
          },
          {
            id: 'm7_c3_c',
            text: 'Demand they pay you a 500-rupee rescue fee on the spot for saving them.',
            isCorrect: false,
            feedback: 'Demanding payment extorts someone who just experienced crisis and is morally indefensible.',
            educationalTip: 'Bystander intervention is rooted in collective civic care and communal safety.'
          }
        ],
        winningNextNodeId: 'VICTORY'
      }
    },
    victoryEnding: {
      title: 'Community Shield Activated',
      description: 'Aira demonstrated the gold standard of bystander intervention—distracting, delegating to security, and providing compassionate post-incident care.',
      takeaway: 'Active bystanders change outcomes. Use the 5Ds (Distract, Delegate, Document, Delay, Direct) safely and always support the survivor.'
    }
  }
];

export const VERIFIED_SUPPORT_RESOURCES: SupportResource[] = [
  {
    id: 'res-112',
    name: 'National Emergency Helpline (Pan-India)',
    category: 'Emergency',
    contact: '112',
    website: 'https://112.gov.in',
    coverage: 'India (All States & Union Territories)',
    description: 'Unified single emergency number for police, fire, medical ambulance, and disaster response services.',
    officialSource: 'Ministry of Home Affairs (MHA), Government of India',
    lastVerified: '2026-03-01',
    tags: ['Emergency', 'Police', 'Ambulance', 'Fire', 'Pan-India']
  },
  {
    id: 'res-1091',
    name: 'Women in Distress National Helpline',
    category: 'Helpline',
    contact: '1091',
    website: 'https://ncw.nic.in',
    coverage: 'Pan-India Police Women Safety Wings',
    description: 'Toll-free 24/7 dedicated police assistance helpline for women experiencing harassment, domestic abuse, or distress in public/private spaces.',
    officialSource: 'National Commission for Women & State Police Organizations',
    lastVerified: '2026-03-01',
    tags: ['Women Safety', 'Police', '24/7 Helpline', 'Distress']
  },
  {
    id: 'res-181',
    name: 'Women Helpline Scheme (WHL)',
    category: 'Helpline',
    contact: '181',
    website: 'https://wcd.nic.in',
    coverage: 'Universal coverage across Indian States & UTs',
    description: '24-hour toll-free telephonic service providing integrated support, rescue, crisis intervention, counseling, and shelter referrals.',
    officialSource: 'Ministry of Women and Child Development (MWCD)',
    lastVerified: '2026-03-01',
    tags: ['Helpline', 'Crisis Counseling', 'Legal Aid Referral', 'Medical Help']
  },
  {
    id: 'res-1930',
    name: 'National Cybercrime Reporting Helpline',
    category: 'Cyber Safety',
    contact: '1930',
    website: 'https://cybercrime.gov.in',
    coverage: 'Pan-India',
    description: 'National helpline to report cyber financial frauds, online harassment, non-consensual image sharing, blackmail, and extortion.',
    officialSource: 'Indian Cyber Crime Coordination Centre (I4C), MHA',
    lastVerified: '2026-03-01',
    tags: ['Cybercrime', 'Digital Extortion', 'Identity Theft', '1930 Helpline']
  },
  {
    id: 'res-1098',
    name: 'Childline India (Now under 112 / Mission Vatsalya)',
    category: 'Campus Support',
    contact: '1098',
    website: 'https://wcd.nic.in/childline',
    coverage: 'Pan-India',
    description: '24-hour emergency helpline service for children and adolescents in need of care, rescue, and protection from violence.',
    officialSource: 'Ministry of Women and Child Development',
    lastVerified: '2026-03-01',
    tags: ['Youth', 'Minors', 'Adolescent Safety', 'Child Protection']
  },
  {
    id: 'res-posh',
    name: 'UGC SAKSHAM / Campus Internal Complaints Portal',
    category: 'Campus Support',
    contact: '1800-111-656',
    website: 'https://saksham.ugc.ac.in',
    coverage: 'Higher Educational Institutions across India',
    description: 'Statutory portal for monitoring and redressing sexual harassment and grievances in universities and colleges under POSH Regulations.',
    officialSource: 'University Grants Commission (UGC)',
    lastVerified: '2026-03-01',
    tags: ['Campus Safety', 'POSH', 'ICC', 'Student Redressal']
  }
];
