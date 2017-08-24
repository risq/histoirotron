module.exports = `
story: <story-intro>///<story-event>///<story-reaction>///<story-adventure>///<story-end>

story-intro: <@hero> se réveille <adj wakeup> <home@place>.
story-intro: <@hero> se réveille <adj wakeup> <home@place>.
story-intro &meet: Cela faisait longtemps que <@hero> pensait à <lover@person> sans oser lui avouer ses sentiments.

story-event &meet: N'ayant rien prévu de sa journée, il se rendit par curiosité à <event> <place>.
story-event &meet: Durant son jogging <place>, il assista par hasard à <event>.
story-event &steal: Tout à coup, il se rendit compte qu'il avait <verb pp lost> <lostobject@object>.///Il est très <adj emotion bad>, il en avait besoin pour <activity> <@place>.
story-event &fight: Tout à coup, il aperçu <enemy@animal> qui s'approche dangereusement de lui.

story-reaction &fight &fight: "C'est lui ou moi", pensa <@hero>, tout en dégainant <weapon@object>.
story-reaction &fight &fight: "Ca commence à suffire !", s'écria <@hero>, tout en ramassant <weapon@object>. "Viens là, je t'attend !"
story-reaction &steal &fight &chase: Il entend <sound> <location near>, c'est <enemy@badguy> qui lui a dérobé <lostobject@object> !
story-reaction &meet: "Vous ici ?" s'écria <@hero> à <lover@person>. "Je n'aurais jamais pensé vous trouver là !
story-reaction &meet: "Vous ici ?" s'écria <@hero> à <lover@person>. "Je n'aurais jamais pensé vous trouver là ! Malheureusement, le son de sa voix ne parvint pas à ses oreilles tant <noise> étaient assourdissant.
story-reaction &meet: "Vous ici ?" s'écria <lover@person>. "Je n'aurais jamais pensé vous trouver là !

story-adventure &meet !happyend: <lover@person> le regardait avec <emotion good>. Dès cette instant, ils surent tous les deux qu'ils étaient faits l'un pour l'autre.
story-adventure &meet !unhappyend: <lover@person> le regardait avec <emotion bad>. "<dialog excuse>", dit-il avant se s'éclipser discrètement.
story-adventure &meet !unhappyend lonely: Intimidé, <@hero> pensa à toutes les déceptions qu'il a du affronter lors de sa misérable existence.
story-adventure &meet !happyend: <@hero> allait prendre son courage à deux mains, mais <illness> le gênait atrocement. Pourtant, l'amour qu'il portait à <lover@person> lui donna la force de surmonter son handicap.
story-adventure &meet: <lover@person> allait prendre son courage à deux mains, mais <illness> le gênait atrocement. Pourtant, l'amour qu'il portait à <@hero> lui donna la force de surmonter son handicap.
story-adventure &meet !unhappyend: Malheureusement, le son de sa voix ne parvint pas à ses oreilles tant <noise> étaient assourdissant.
story-adventure &fight !unhappyend: <enemy@badguy> bondit sur <@hero> en rugissant et l'attrapa par <member>.///Avant qu'il n'aie eu le temps de comprendre, <@hero> était à terre. Il essaya de se débattre avec <weapon@object> mais c'était déjà trop tard.
story-adventure &chase !happyend: <@hero> se lanca à sa poursuite <locomotion>.///<enemy@badguy> tenta de se sauver mais <ìllness> l'empêchait de courir trop vite. Epuisé, il <fall pp>.
story-adventure &chase !unhappyend: <@hero> tenta de l'attirer en déposant <location ground> <food>.///Mais <enemy@badguy> n'est pas dupe, il comprend vite qu'il s'agit d'un piège et s'enfuit rapidement <locomotion>.

story-end happyend &steal &fight: <@hero> est <adj emotion good>, il va pouvoir <revenge>.
story-end happyend: <@hero> respira un grand coup. Soulagé, il fit demi-tour et rentra <home@place>
story-end unhappyend: <adj sad>, <@hero> fit demi-tour et rentra <home@place> en essayant de ne plus y penser...

hero: Jackie le boucher
hero: Minet le Chat
badguy hippie: John Lennon
badguy: Bobby le raton laveur
badguy: Marcel le cochon
badguy scifi: l'empereur Zorg
badguy scifi cute: (un,le) martien pacifique
verb pp lost: égaré
verb pp lost: perdu
animal: (un,le) grizzly <adj attitude>
animal cute: (un,le) canard <adj attitude>
object: sa canne à pèche préférée
object: son trophée de pétanque
object: (le plus beau de ses slips,son slip)
object forest: le fusils de <person>
object hippie: la guitare de <person>
object drug: son grinder électrique
member: la jambe droite
member: les cheveux
member: le T-shirt
person hippie: Jimi Hendrix
person: son grand père
person: son neuveu
noise scifi: le bruit des tirs de fusils lasers
noise scifi: le bruit du réacteur thermonucléaire
noise pirate: le bruit des tirs de canons
noise pirate: le son des hurlements des prisonniers
noise pirate: le bruit de la houle
noise underwater: le son du silence
noise hippie: le battement des djembés
noise capitalism: le bruit de la photocopieuse
noise jazz: le saxophone d'un musicien égaré
noise metal hippie: le solo endiablé d'un guitariste aux cheveux longs et sales
noise banquise: le chant nuptial des pinguins
adj wakeup: difficilement
adj wakeup drug: encore bourré
adj wakeup: en retard, comme d'habitude,
adj wakeup: seul, comme toujours,
adj sad: triste
adj sad: déboussolé
adj emotion good: éxité
adj emotion bad: troublé
adj emotion good: attendrit
adj emotion good: charmé
adj attitude: féroce
adj attitude: égaré
adj attitude: appeuré
adj attitude: à l'air niais
emotion good: tendresse
emotion good: désir
emotion good: passion
emotion good: empathie
emotion good: joie
emotion good: entrain
emotion bad: dédain
emotion bad: dégout
emotion bad: pitié
emotion bad: haine
location near: derrière le canapé
location near pirate: sur le pont du bateau
location near: droit devant
location ground: sur le sol
location ground: sur le tapis
location ground: sur le paillasson
place: au milieu de nulle part
place scifi: sur la nébuleuse d'Orion
place scifi: au cratère nord
place forest: dans (une,la) taupinière
place forest: à la cabane de chasse
place hippie: sur les collines de Woodstock
place drug: sous un pont
locomotion scifi: à bord de son scooter volant supersonique
locomotion forest: en se balançant de lianne en lianne
locomotion pirate: dans une petite barque de pêcheur
fall pp: s'écroula par terre
fall pp: glissa sur <obstacle> et tomba <location ground>
obstacle forest: un tas de feuilles sèches
obstacle cute: une fontaine de chocolat
obstacle drug: une seringue usagée
food: une glace à la vanille
food: un reste de poulet fermier
food: une bouteille de rouge pas très chère
ìllness pirate: sa jambe de bois
ìllness: sa myopie sévère
ìllness: son addiction <drug>
ìllness: ses troubles obsessionels du comportement
illness cute: ses jambes en chamallow
drug drug hippie: à l'héroine
drug drug hippie mushroom: aux champigons
drug cheese: au fromage
drug cheese: à l'époisses
drug metal drug: à la bière
drug drug pirate: au rhum ambré
sound: un claquement de fouet
sound: un gémissement langoureux
sound: une branche craquer
sound: des pas s'éloigner
activity cute: son recital de danse
activity forest: sa partie de chasse
activity: son rendez vous chez le banquier
activity forest drug: une rave party
activity hippie: une manifestation pacifique
activity scifi: son voyage à travers le temps
event prehistoric: une chasse au mamouth
event voodoo: un rituel de reducteur de tête
event voodoo metal: une cérémonie sataniste
event lumieres: une soirée mondaine
event lumieres vietnam: une éxecution publique
event semur: une partie de molku fluorescent
event cheese: une d'une dégustation de mozarella
event cheese: une d'une dégustation d'époisse
event mushroom: une ceuillette de champigons pour célibataires
event bobo: un cours de cuisine vegan
event bobo: un séminaires sur les chausettes-claquettes
event banquise pirate: lors d'une chasse aux phoques illégale
revenge: lui mettre une féssée
revenge: lui faire bouffer ses couilles
revenge cute: lui faire un gros calin
revenge cute: lui faire des bisoux sur le ventre
dialog excuse: Mince alors, je dois justement <excuse> !
dialog excuse: Ca tombe mal, j'avais justement prévu de <excuse> !
dialog excuse: J'adorerais discuter avec vous mais je dois <excuse>
excuse pirate: aller laver le pont du bateau
excuse: rentrer tôt ce soir
excuse: aider ma mère à faire la vaisselle
excuse capitalism: aller compter mes billets, j'en ai pour un moment
`.split('\n').filter(line => line);
