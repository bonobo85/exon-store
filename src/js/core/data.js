// Product Data
const products = {
    cars: [
        // Exemple de produit (décommenter et modifier pour ajouter un nouveau produit) :
        /*
        {
            id: 'car-xx',                    // identifiant unique
            category: 'cars',                // doit correspondre au nom de la catégorie
            title: 'Nom du produit',
            subtitle: 'SOUS-TITRE',
            description: 'Courte description du produit.',
            price: 0.00,                     // prix en euros
            // champs optionnels : originalPrice, badge, badgeClass, gradientFrom, gradientTo, details, features
            gradientFrom: 'from-color-900',
            gradientTo: 'to-color-950',
            details: 'Description détaillée visible dans la modale.',
            features: ['Point 1', 'Point 2', 'Point 3']
        },
        */
        {
            id: 'car-civil-1',
            category: 'cars',
            tag: 'civil',
            title: 'Audi RS6 Civil',
            subtitle: 'CIVIL',
            description: 'Break sportif premium pour circulation civile, équilibré et réaliste.',
            price: 12.99,
            badge: 'CIVIL',
            badgeClass: 'product-badge',
            gradientFrom: 'from-blue-900',
            gradientTo: 'to-blue-950',
            productTags: ['PREMIUM', 'SPORT', 'BREAK', 'HD', 'LORE FRIENDLY', 'OPTIMISÉ'],
            details: 'Pack Audi RS6 optimisé FiveM pour usage civil avec handling stable et finitions HQ. Un break sportif exceptionnel combinant puissance, élégance et praticité pour vos serveurs FiveM.',
            features: [
                '✅ FiveM Ready',
                '✅ Textures HD haute qualité',
                '✅ Handling équilibré et réaliste',
                '✅ Intérieur détaillé',
                '✅ Fenêtres teintables',
                '✅ Cartographie réaliste des salissures',
                '✅ Personnalisation complète',
                '✅ Optimisé pour les performances'
            ],
            technicalDetails: {
                'Spawn Name': 'audirs6civil',
                'Poly Count': '85,420',
                'Vertices': '65,230',
                'YFT Size': '1.95 MB',
                'YTD Size': '245 KB'
            },
            importantInfo: [
                'Entièrement conforme aux politiques FiveM et Rockstar',
                'Ne contient aucune marque commerciale réelle',
                'Version cryptée fournie lors de l\'achat',
                'Support technique inclus'
            ],
            images: [
                'https://i.postimg.cc/QNb0H6FR/exon.png',
                'https://i.postimg.cc/QNb0H6FR/exon.png',
                'https://i.postimg.cc/QNb0H6FR/exon.png',
                'https://i.postimg.cc/QNb0H6FR/exon.png',
                'https://i.postimg.cc/QNb0H6FR/exon.png'
            ]
        },
        {
            id: 'car-police-1',
            category: 'cars',
            tag: 'police',
            policeSubcategory: 'glasslight-marked',
            title: 'Dodge Charger Police',
            subtitle: 'POLICE - GLASSLIGHT MARKED',
            description: 'Intercepteur police complet avec setup sirènes et équipement RP.',
            price: 14.99,
            badge: 'POLICE',
            badgeClass: 'bg-blue-500 text-white',
            gradientFrom: 'from-indigo-900',
            gradientTo: 'to-indigo-950',
            productTags: ['POLICE', 'INTERCEPTOR', 'GLASSLIGHT', 'MARKED', 'LORE FRIENDLY', 'OPTIMISÉ'],
            details: "Véhicule police prêt à l'emploi avec lightbar, livrée et extras configurés. Intercepteur haute performance pour les forces de l'ordre, équipé de sirènes lumineuses et prêt pour le roleplay.",
            features: [
                '✅ Livrée police personnalisée',
                '✅ Sirènes configurées (Glass Light)',
                '✅ Extras inclus (équipement police)',
                '✅ Prêt serveur RP',
                '✅ Handling optimisé poursuite',
                '✅ Intérieur détaillé police',
                '✅ Lightbar fonctionnelle',
                '✅ Compatibilité ELS'
            ],
            technicalDetails: {
                'Spawn Name': 'chargerpolice',
                'Poly Count': '95,340',
                'Vertices': '72,150',
                'YFT Size': '2.15 MB',
                'YTD Size': '280 KB'
            },
            importantInfo: [
                'Configuration ELS incluse',
                'Livrée personnalisable selon vos besoins',
                'Installation rapide et guidée',
                'Support technique prioritaire'
            ],
            images: []
        },
        {
            id: 'car-police-2',
            category: 'cars',
            tag: 'police',
            policeSubcategory: 'els-unmarked',
            title: 'Unmarked Police Charger',
            subtitle: 'POLICE - ELS UNMARKED',
            description: 'Voiture de police banalisée avec équipement ELS intégré.',
            price: 15.99,
            badge: 'POLICE',
            badgeClass: 'bg-blue-500 text-white',
            gradientFrom: 'from-indigo-900',
            gradientTo: 'to-indigo-950',
            productTags: ['UNMARKED', 'ELS', 'STEALTH', 'UNDERCOVER', 'LORE FRIENDLY', 'OPTIMISÉ'],
            details: 'Véhicule banalisé avec sirènes ELS cachées et équipement discret. Parfait pour les opérations d\'infiltration et la surveillance discrète avec toute la puissance d\'un intercepteur police.',
            features: [
                '✅ Apparence civile banalisée',
                '✅ Sirènes ELS cachées',
                '✅ Équipement discret intégré',
                '✅ Missions undercover',
                '✅ Handling police optimisé',
                '✅ Intérieur civil modifié',
                '✅ Radio police cachée',
                '✅ Surveillance discrète'
            ],
            technicalDetails: {
                'Spawn Name': 'chargerunmarked',
                'Poly Count': '92,180',
                'Vertices': '69,840',
                'YFT Size': '2.08 MB',
                'YTD Size': '265 KB'
            },
            importantInfo: [
                'Configuration ELS cachée pour discrétion maximale',
                'Apparence 100% civile banalisée',
                'Installation avec guide ELS inclus',
                'Idéal pour missions undercover et infiltration'
            ],
            images: []
        },
        {
            id: 'car-police-3',
            category: 'cars',
            tag: 'police',
            policeSubcategory: 'els-marked',
            title: 'Marked Police Crown',
            subtitle: 'POLICE - ELS MARKED',
            description: 'Voiture de patrouille officielle avec sirènes ELS visibles.',
            price: 16.99,
            badge: 'POLICE',
            badgeClass: 'bg-blue-500 text-white',
            gradientFrom: 'from-indigo-900',
            gradientTo: 'to-indigo-950',
            productTags: ['MARKED', 'ELS', 'PATROL', 'HIGH VISIBILITY', 'LORE FRIENDLY', 'OPTIMISÉ'],
            details: 'Véhicule de patrouille marqué avec sirènes ELS et livrée officielle. Crown Victoria iconique avec équipement police complet et haute visibilité pour patrouilles urbaines.',
            features: [
                '✅ Livrée police officielle marquée',
                '✅ Système ELS complet',
                '✅ Lightbar haute visibilité',
                '✅ Patrouille urbaine optimisée',
                '✅ Radio et équipement RP',
                '✅ Extras police configurables',
                '✅ Handling stable',
                '✅ Intérieur police détaillé'
            ],
            technicalDetails: {
                'Spawn Name': 'crowpolice',
                'Poly Count': '88,650',
                'Vertices': '67,230',
                'YFT Size': '2.02 MB',
                'YTD Size': '295 KB'
            },
            importantInfo: [
                'ELS configuré avec patterns multiples',
                'Livrée personnalisable pour votre département',
                'Compatible avec tous les scripts police',
                'Installation ELS simplifiée avec tutoriel'
            ],
            images: []
        },
        {
            id: 'car-police-4',
            category: 'cars',
            tag: 'police',
            policeSubcategory: 'non-els-unmarked',
            title: 'Unmarked Police Sedan',
            subtitle: 'POLICE - NON-ELS UNMARKED',
            description: 'Véhicule police banalisé sans équipement de sirènes ELS.',
            price: 13.99,
            badge: 'POLICE',
            badgeClass: 'bg-blue-500 text-white',
            gradientFrom: 'from-indigo-900',
            gradientTo: 'to-indigo-950',
            productTags: ['UNMARKED', 'NON-ELS', 'BUDGET', 'DISCRETE', 'LORE FRIENDLY', 'OPTIMISÉ'],
            details: 'Voiture banalisée simple pour missions discrètes ou civiles. Berline police sans sirènes ELS, idéale pour serveurs budget ou surveillance légère.',
            features: [
                '✅ 100% civil en apparence',
                '✅ Sans système ELS',
                '✅ Discrétion maximale',
                '✅ Polyvalent RP',
                '✅ Budget friendly',
                '✅ Handling civil modifié',
                '✅ Installation simple',
                '✅ Compatible tous frameworks'
            ],
            technicalDetails: {
                'Spawn Name': 'sedanunmarked',
                'Poly Count': '78,340',
                'Vertices': '58,920',
                'YFT Size': '1.78 MB',
                'YTD Size': '220 KB'
            },
            importantInfo: [
                'Aucune configuration ELS requise',
                'Installation ultra-rapide plug and play',
                'Parfait pour serveurs avec budget limité',
                'Idéal missions surveillance et infiltration'
            ],
            images: []
        },
        {
            id: 'car-police-5',
            category: 'cars',
            tag: 'police',
            policeSubcategory: 'non-els-marked',
            title: 'Marked Police Patrol',
            subtitle: 'POLICE - NON-ELS MARKED',
            description: 'Voiture de patrouille marquée sans sirènes ELS modernes.',
            price: 12.99,
            badge: 'POLICE',
            badgeClass: 'bg-blue-500 text-white',
            gradientFrom: 'from-indigo-900',
            gradientTo: 'to-indigo-950',
            productTags: ['MARKED', 'NON-ELS', 'CLASSIC', 'BUDGET FRIENDLY', 'LORE FRIENDLY', 'OPTIMISÉ'],
            details: 'Véhicule patrol marqué avec équipement simple et sirènes basiques. Solution économique pour patrouilles avec livrée officielle sans complexité ELS.',
            features: [
                '✅ Livrée police marquée',
                '✅ Sans système ELS',
                '✅ Sirènes natives GTA',
                '✅ Budget friendly',
                '✅ Installation simple',
                '✅ Patrouille standard',
                '✅ Extras basiques inclus',
                '✅ Style classique'
            ],
            technicalDetails: {
                'Spawn Name': 'patrolmarked',
                'Poly Count': '76,890',
                'Vertices': '57,340',
                'YFT Size': '1.73 MB',
                'YTD Size': '215 KB'
            },
            importantInfo: [
                'Solution économique sans ELS',
                'Parfait pour serveurs débutants',
                'Sirènes natives GTA incluses',
                'Livrée personnalisable facilement'
            ],
            images: []
        },
        {
            id: 'car-ambulance-1',
            category: 'cars',
            tag: 'ambulance',
            ambulanceSubcategory: 'glasslight-marked',
            title: 'Mercedes Sprinter EMS Glasslight',
            subtitle: 'AMBULANCE - GLASSLIGHT MARKED',
            description: 'Ambulance moderne avec glasslight visible et livrée médicale officielle.',
            price: 13.49,
            badge: 'EMS',
            badgeClass: 'bg-red-500 text-white',
            gradientFrom: 'from-red-900',
            gradientTo: 'to-red-950',
            productTags: ['EMS', 'MEDICAL', 'GLASSLIGHT', 'MARKED', 'LORE FRIENDLY', 'OPTIMISÉ'],
            details: 'Sprinter EMS complet pour services médicaux RP avec animations et accessoires. Ambulance premium avec intérieur médical détaillé et équipement professionnel.',
            features: [
                '✅ Glasslight visible intégrée',
                '✅ Livrée EMS officielle',
                '✅ Intérieur médical complet',
                '✅ Animations compatibles',
                '✅ Équipement médical détaillé',
                '✅ Optimisé serveur RP',
                '✅ Brancards et accessoires',
                '✅ Sirènes médicales'
            ],
            technicalDetails: {
                'Spawn Name': 'sprinterems',
                'Poly Count': '105,340',
                'Vertices': '81,250',
                'YFT Size': '2.48 MB',
                'YTD Size': '335 KB'
            },
            importantInfo: [
                'Intérieur médical entièrement équipé',
                'Glasslight configurable selon besoins',
                'Compatible tous scripts médicaux RP',
                'Livrée personnalisable pour votre service'
            ],
            images: []
        },
        {
            id: 'car-ambulance-2',
            category: 'cars',
            tag: 'ambulance',
            ambulanceSubcategory: 'glasslight-unmarked',
            title: 'Ambulance Banalisée Glasslight',
            subtitle: 'AMBULANCE - GLASSLIGHT UNMARKED',
            description: 'Ambulance banalisée avec glasslight discrète pour interventions spéciales.',
            price: 14.99,
            badge: 'EMS',
            badgeClass: 'bg-red-500 text-white',
            gradientFrom: 'from-red-900',
            gradientTo: 'to-red-950',
            productTags: ['EMS', 'GLASSLIGHT', 'UNMARKED', 'STEALTH', 'LORE FRIENDLY', 'OPTIMISÉ'],
            details: 'Ambulance banalisée avec glasslight intégrée de manière discrète. Véhicule médical sans marquage pour missions spéciales et transferts confidentiels.',
            features: [
                '✅ Glasslight discrète cachée',
                '✅ Sans livrée visible',
                '✅ Intérieur médical équipé',
                '✅ Missions spéciales EMS',
                '✅ Apparence civile',
                '✅ Équipement complet intérieur',
                '✅ Discrétion maximale',
                '✅ Transferts confidentiels'
            ],
            technicalDetails: {
                'Spawn Name': 'ambulanceunmarked',
                'Poly Count': '98,760',
                'Vertices': '76,430',
                'YFT Size': '2.31 MB',
                'YTD Size': '305 KB'
            },
            importantInfo: [
                'Glasslight cachée pour discrétion',
                'Idéal pour transferts VIP ou spéciaux',
                'Équipement médical intérieur complet',
                'Installation glasslight simplifiée'
            ],
            images: []
        },
        {
            id: 'car-ambulance-3',
            category: 'cars',
            tag: 'ambulance',
            ambulanceSubcategory: 'els-marked',
            title: 'Ambulance ELS Marquée',
            subtitle: 'AMBULANCE - ELS MARKED',
            description: 'Ambulance avec système ELS complet et livrée officielle visible.',
            price: 15.99,
            badge: 'EMS',
            badgeClass: 'bg-red-500 text-white',
            gradientFrom: 'from-red-800',
            gradientTo: 'to-red-900',
            productTags: ['EMS', 'ELS', 'MARKED', 'HIGH VISIBILITY', 'LORE FRIENDLY', 'OPTIMISÉ'],
            details: 'Ambulance ELS avec sirènes complètes et livrée médicale officielle. Configuration ELS avancée avec patterns multiples pour haute visibilité en urgence.',
            features: [
                '✅ Système ELS complet',
                '✅ Livrée médicale marquée',
                '✅ Haute visibilité maximale',
                '✅ Équipement médical complet',
                '✅ Patterns ELS multiples',
                '✅ Sirènes synchronisées',
                '✅ Lightbar professionnelle',
                '✅ Urgences haute priorité'
            ],
            technicalDetails: {
                'Spawn Name': 'ambulanceels',
                'Poly Count': '108,920',
                'Vertices': '84,560',
                'YFT Size': '2.56 MB',
                'YTD Size': '350 KB'
            },
            importantInfo: [
                'Configuration ELS avec 8+ patterns inclus',
                'Livrée haute visibilité personnalisable',
                'Compatible tous scripts EMS',
                'Installation ELS détaillée fournie'
            ],
            images: []
        },
        {
            id: 'car-ambulance-4',
            category: 'cars',
            tag: 'ambulance',
            ambulanceSubcategory: 'els-unmarked',
            title: 'Ambulance ELS Banalisée',
            subtitle: 'AMBULANCE - ELS UNMARKED',
            description: 'Ambulance banalisée avec sirènes ELS cachées pour opérations discrètes.',
            price: 16.49,
            badge: 'EMS',
            badgeClass: 'bg-red-500 text-white',
            gradientFrom: 'from-red-800',
            gradientTo: 'to-red-900',
            productTags: ['EMS', 'ELS', 'UNMARKED', 'DISCRETE', 'LORE FRIENDLY', 'OPTIMISÉ'],
            details: 'Ambulance ELS banalisée avec sirènes dissimulées. Véhicule médical discret avec toute la puissance ELS pour interventions spéciales.',
            features: [
                '✅ Sirènes ELS cachées',
                '✅ Sans livrée externe',
                '✅ Discrétion totale',
                '✅ Opérations spéciales EMS',
                '✅ Intérieur médical complet',
                '✅ Configuration ELS avancée',
                '✅ Apparence civile',
                '✅ Missions confidentielles'
            ],
            technicalDetails: {
                'Spawn Name': 'ambulanceelsunmarked',
                'Poly Count': '104,680',
                'Vertices': '80,920',
                'YFT Size': '2.45 MB',
                'YTD Size': '330 KB'
            },
            importantInfo: [
                'ELS caché pour opérations discrètes',
                'Parfait pour transferts VIP ou spéciaux',
                'Configuration ELS complète fournie',
                'Équipement médical professionnel intérieur'
            ],
            images: []
        },
        {
            id: 'car-ambulance-5',
            category: 'cars',
            tag: 'ambulance',
            ambulanceSubcategory: 'non-els-marked',
            title: 'Ambulance Classique Marquée',
            subtitle: 'AMBULANCE - NON-ELS MARKED',
            description: 'Ambulance traditionnelle avec sirènes standard et livrée officielle.',
            price: 12.99,
            badge: 'EMS',
            badgeClass: 'bg-red-500 text-white',
            gradientFrom: 'from-red-900',
            gradientTo: 'to-red-950',
            productTags: ['EMS', 'NON-ELS', 'MARKED', 'CLASSIC', 'LORE FRIENDLY', 'OPTIMISÉ'],
            details: 'Ambulance classique avec sirènes simples et livrée visible. Solution économique pour services médicaux sans complexité ELS.',
            features: [
                '✅ Sirènes standard GTA',
                '✅ Livrée EMS marquée',
                '✅ Style classique',
                '✅ Budget friendly',
                '✅ Installation simple',
                '✅ Intérieur médical basique',
                '✅ Parfait serveurs débutants',
                '✅ Plug and play'
            ],
            technicalDetails: {
                'Spawn Name': 'ambulanceclassic',
                'Poly Count': '89,450',
                'Vertices': '68,720',
                'YFT Size': '2.08 MB',
                'YTD Size': '275 KB'
            },
            importantInfo: [
                'Aucune configuration ELS requise',
                'Installation instantanée plug and play',
                'Parfait pour serveurs budget limité',
                'Livrée EMS officielle personnalisable'
            ],
            images: []
        },
        {
            id: 'car-ambulance-6',
            category: 'cars',
            tag: 'ambulance',
            ambulanceSubcategory: 'non-els-unmarked',
            title: 'Ambulance Banalisée Standard',
            subtitle: 'AMBULANCE - NON-ELS UNMARKED',
            description: 'Ambulance banalisée avec équipement simple pour missions discrètes.',
            price: 11.99,
            badge: 'EMS',
            badgeClass: 'bg-red-500 text-white',
            gradientFrom: 'from-red-900',
            gradientTo: 'to-red-950',
            productTags: ['EMS', 'NON-ELS', 'UNMARKED', 'BUDGET', 'LORE FRIENDLY', 'OPTIMISÉ'],
            details: 'Ambulance banalisée simple sans sirènes ELS. Solution économique pour transferts discrets sans équipement complexe.',
            features: [
                '✅ Sans système ELS',
                '✅ 100% banalisée',
                '✅ Discrétion totale',
                '✅ Prix abordable',
                '✅ Installation immédiate',
                '✅ Transferts basiques',
                '✅ Apparence civile pure',
                '✅ Budget optimal'
            ],
            technicalDetails: {
                'Spawn Name': 'ambulanceunmarkedbasic',
                'Poly Count': '85,230',
                'Vertices': '65,480',
                'YFT Size': '1.98 MB',
                'YTD Size': '260 KB'
            },
            importantInfo: [
                'Solution la plus économique de la gamme',
                'Aucune configuration technique requise',
                'Parfait pour serveurs débutants',
                'Transferts médicaux discrets basiques'
            ],
            images: []
        },
        {
            id: 'car-pack-1',
            category: 'cars',
            tag: 'pack',
            title: 'City Starter Pack',
            subtitle: 'PACK',
            description: 'Pack de véhicules multi-usages pour lancer rapidement un serveur.',
            price: 24.99,
            originalPrice: 35.99,
            badge: 'PACK',
            badgeClass: 'bg-purple-500 text-white',
            gradientFrom: 'from-purple-900',
            gradientTo: 'to-purple-950',
            productTags: ['PACK', 'BUNDLE', '-30%', 'STARTER'],
            details: 'Pack comprenant 8 véhicules civils, service public et utilitaires. Solution économique pour démarrer votre serveur FiveM avec un garage complet et diversifié.',
            features: [
                '✅ 8 véhicules inclus',
                '✅ Mix civil et service',
                '✅ Installation simple',
                '✅ Bundle économique (-30%)',
                '✅ Tous FiveM Ready',
                '✅ Documentation complète',
                '✅ Support prioritaire',
                '✅ Mises à jour gratuites'
            ],
            technicalDetails: {
                'Nombre de véhicules': '8',
                'Types': 'Civil, Police, EMS, Utilitaires',
                'Taille totale': '12.5 MB',
                'Format': 'Optimisé FiveM'
            },
            importantInfo: [
                'Pack contient 8 véhicules complets',
                'Économisez 30% par rapport à l\'achat séparé',
                'Installation guidée étape par étape',
                'Tous les véhicules sont personnalisables'
            ],
            images: []
        },
        {
            id: 'car-seasonal-1',
            category: 'cars',
            tag: 'seasonal',
            seasonalSubcategory: 'winter',
            title: 'Winter Patrol SUV',
            subtitle: 'SEASONAL',
            description: 'SUV édition saisonnière avec style hivernal et setup neige.',
            price: 10.99,
            badge: 'SEASONAL',
            badgeClass: 'bg-cyan-500 text-white',
            gradientFrom: 'from-cyan-900',
            gradientTo: 'to-cyan-950',
            productTags: ['LIMITED EDITION', 'WINTER', 'SEASONAL', 'EXCLUSIVE'],
            details: 'Édition limitée saison hiver avec textures dédiées et réglages adaptés. SUV spécial hiver avec livrée enneigée et handling optimisé pour conditions hivernales RP.',
            features: [
                '✅ Édition limitée exclusive',
                '✅ Skin hivernal unique',
                '✅ Réglages neige adaptés',
                '✅ Compatible RP hiver',
                '✅ Textures givre et neige',
                '✅ Handling conditions froides',
                '✅ Décors saisonniers',
                '✅ Collection limitée'
            ],
            technicalDetails: {
                'Spawn Name': 'wintersuv',
                'Poly Count': '82,340',
                'Vertices': '63,180',
                'YFT Size': '1.88 MB',
                'YTD Size': '255 KB'
            },
            importantInfo: [
                'Édition saisonnière limitée hiver',
                'Textures exclusives thème hivernal',
                'Disponible uniquement pendant la saison',
                'Collection spéciale pour serveurs RP'
            ],
            images: []
        },
        {
            id: 'car-seasonal-2',
            category: 'cars',
            tag: 'seasonal',
            seasonalSubcategory: 'spring',
            title: 'Spring City Coupe',
            subtitle: 'SEASONAL',
            description: 'Coupé édition printemps avec palette fleurie et conduite souple.',
            price: 10.99,
            badge: 'SEASONAL',
            badgeClass: 'bg-green-500 text-white',
            gradientFrom: 'from-green-900',
            gradientTo: 'to-emerald-950',
            productTags: ['LIMITED EDITION', 'SPRING', 'SEASONAL', 'EXCLUSIVE'],
            details: 'Edition limitée saison printemps avec textures fraîches et style urbain. Coupé printanier avec couleurs pastel et décors floraux pour atmosphère renouvelante.',
            features: [
                '✅ Edition limitée printemps',
                '✅ Skin printanier exclusif',
                '✅ Conduite fluide optimisée',
                '✅ Compatible RP saison',
                '✅ Palette couleurs pastel',
                '✅ Décors floraux',
                '✅ Style urbain frais',
                '✅ Collection exclusive'
            ],
            technicalDetails: {
                'Spawn Name': 'springcoupe',
                'Poly Count': '79,560',
                'Vertices': '60,840',
                'YFT Size': '1.82 MB',
                'YTD Size': '245 KB'
            },
            importantInfo: [
                'Édition saisonnière limitée printemps',
                'Textures exclusives thème floral',
                'Disponible uniquement pendant la saison',
                'Parfait pour RP atmosphère printanière'
            ],
            images: []
        },
        {
            id: 'car-seasonal-3',
            category: 'cars',
            tag: 'seasonal',
            seasonalSubcategory: 'summer',
            title: 'Summer Beach Cabrio',
            subtitle: 'SEASONAL',
            description: 'Cabriolet édition été pensé pour les zones côtières et cruising.',
            price: 10.99,
            badge: 'SEASONAL',
            badgeClass: 'bg-yellow-500 text-black',
            gradientFrom: 'from-yellow-700',
            gradientTo: 'to-amber-900',
            productTags: ['LIMITED EDITION', 'SUMMER', 'SEASONAL', 'EXCLUSIVE'],
            details: 'Edition limitée saison été avec look ensoleillé et setup loisir. Cabriolet estival parfait pour balades côtières et atmosphère vacances.',
            features: [
                '✅ Edition limitée été',
                '✅ Skin estival vibrant',
                '✅ Style cabriolet ouvert',
                '✅ Compatible RP plage',
                '✅ Couleurs soleil',
                '✅ Handling cruising',
                '✅ Atmosphère vacances',
                '✅ Collection exclusive'
            ],
            technicalDetails: {
                'Spawn Name': 'summercabrio',
                'Poly Count': '81,920',
                'Vertices': '62,540',
                'YFT Size': '1.86 MB',
                'YTD Size': '250 KB'
            },
            importantInfo: [
                'Édition saisonnière limitée été',
                'Textures exclusives thème plage',
                'Disponible uniquement pendant la saison',
                'Idéal pour RP zones côtières'
            ],
            images: []
        },
        {
            id: 'car-seasonal-4',
            category: 'cars',
            tag: 'seasonal',
            seasonalSubcategory: 'autumn',
            title: 'Autumn Touring Wagon',
            subtitle: 'SEASONAL',
            description: 'Break édition automne avec teintes chaudes et setup route longue.',
            price: 10.99,
            badge: 'SEASONAL',
            badgeClass: 'bg-orange-500 text-white',
            gradientFrom: 'from-orange-900',
            gradientTo: 'to-amber-950',
            productTags: ['LIMITED EDITION', 'AUTUMN', 'SEASONAL', 'EXCLUSIVE'],
            details: 'Edition limitée saison automne avec finitions confort pour trajets RP. Break automnal avec couleurs chaudes et atmosphère cosy pour longs trajets.',
            features: [
                '✅ Edition limitée automne',
                '✅ Skin automnal unique',
                '✅ Confort touring optimisé',
                '✅ Compatible RP long trajet',
                '✅ Teintes chaudes',
                '✅ Atmosphère cosy',
                '✅ Style break familial',
                '✅ Collection exclusive'
            ],
            technicalDetails: {
                'Spawn Name': 'autumnwagon',
                'Poly Count': '83,780',
                'Vertices': '64,290',
                'YFT Size': '1.91 MB',
                'YTD Size': '258 KB'
            },
            importantInfo: [
                'Édition saisonnière limitée automne',
                'Textures exclusives thème automnal',
                'Disponible uniquement pendant la saison',
                'Parfait pour RP atmosphère automnale'
            ],
            images: []
        },
        {
            id: 'car-free-1',
            category: 'cars',
            tags: ['police', 'free'],
            title: 'Compact Free Starter',
            subtitle: 'FREE',
            description: 'Véhicule gratuit pour démarrer rapidement sur ton serveur.',
            price: 0,
            badge: 'FREE',
            badgeClass: 'bg-green-500 text-white',
            gradientFrom: 'from-emerald-900',
            gradientTo: 'to-emerald-950',
            productTags: ['GRATUIT', '100% FREE', 'STARTER', 'NO COST'],
            details: 'Modèle gratuit optimisé, prêt à installer, parfait pour un premier déploiement. Ce véhicule compact est idéal pour tester notre qualité sans engagement.',
            features: [
                '✅ 100% gratuit',
                '✅ Installation rapide',
                '✅ Optimisé FiveM',
                '✅ Bon point de départ',
                '✅ Aucune restriction',
                '✅ Documentation fournie',
                '✅ Parfait pour découvrir',
                '✅ Compatible tous serveurs'
            ],
            technicalDetails: {
                'Spawn Name': 'compactfree',
                'Poly Count': '45,200',
                'Vertices': '32,100',
                'YFT Size': '980 KB',
                'YTD Size': '125 KB'
            },
            importantInfo: [
                'Téléchargement gratuit instantané',
                'Aucun frais caché',
                'Utilisation commerciale autorisée',
                'Idéal pour débuter avec nos produits'
            ],
            images: []
        },
        {
            id: 'car-civil-2',
            category: 'cars',
            tag: 'civil',
            title: 'BMW M5 Civil',
            subtitle: 'CIVIL - LUXE',
            description: 'Berline sport luxe pour usage civil avec finitions premium.',
            price: 15.99,
            badge: 'CIVIL',
            badgeClass: 'product-badge',
            gradientFrom: 'from-gray-900',
            gradientTo: 'to-gray-950',
            productTags: ['LUXURY', 'SPORT SEDAN', 'PREMIUM', 'HIGH-END', 'LORE FRIENDLY', 'OPTIMISÉ'],
            details: 'BMW M5 optimisé FiveM avec intérieur luxe, animations fluides et textures HD. Berline sport premium allégiant puissance et élégance pour VIP et businessmen RP.',
            features: [
                '✅ Berline sport premium',
                '✅ Finitions luxe HD',
                '✅ Animations fluides',
                '✅ Textures haute qualité',
                '✅ Intérieur cuir détaillé',
                '✅ Handling sport équilibré',
                '✅ Personnalisation complète',
                '✅ Performance optimisée'
            ],
            technicalDetails: {
                'Spawn Name': 'bmwm5civil',
                'Poly Count': '91,480',
                'Vertices': '70,320',
                'YFT Size': '2.11 MB',
                'YTD Size': '275 KB'
            },
            importantInfo: [
                'Berline sport luxe haute performance',
                'Idéale pour personnages VIP et business',
                'Textures intérieur premium détaillées',
                'Compatible tous frameworks FiveM'
            ],
            images: []
        },
        {
            id: 'car-civil-3',
            category: 'cars',
            tag: 'civil',
            title: 'Mercedes G-Class',
            subtitle: 'CIVIL - SUV',
            description: 'SUV premium tout-usage pour civil avec confort et performances.',
            price: 17.99,
            badge: 'CIVIL',
            badgeClass: 'product-badge',
            gradientFrom: 'from-stone-900',
            gradientTo: 'to-stone-950',
            productTags: ['SUV', 'LUXURY', 'OFF-ROAD', 'PREMIUM', 'LORE FRIENDLY', 'OPTIMISÉ'],
            details: 'Mercedes G-Class avec handling robuste, détails réalistes et optimisation RP. SUV luxe iconique combinant élégance urbaine et capacités tout-terrain.',
            features: [
                '✅ SUV premium iconique',
                '✅ Capacités tout-terrain',
                '✅ Handling robuste optimisé',
                '✅ Détails réalistes HD',
                '✅ Intérieur luxe complet',
                '✅ Hauteur de caisse ajustée',
                '✅ Polyvalent urbain/off-road',
                '✅ Personnalisation avancée'
            ],
            technicalDetails: {
                'Spawn Name': 'gclass',
                'Poly Count': '96,850',
                'Vertices': '75,120',
                'YFT Size': '2.24 MB',
                'YTD Size': '295 KB'
            },
            importantInfo: [
                'SUV luxe polyvalent urbain et tout-terrain',
                'Parfait pour VIP et personnages haut standing',
                'Handling adapté routes et off-road',
                'Intérieur premium entièrement détaillé'
            ],
            images: []
        },
        {
            id: 'car-police-6',
            category: 'cars',
            tag: 'police',
            policeSubcategory: 'glasslight-unmarked',
            title: 'Police Interceptor Utility',
            subtitle: 'POLICE - GLASSLIGHT UNMARKED',
            description: 'Fourgon police alternatif avec équipement léger et sirènes.',
            price: 14.49,
            badge: 'POLICE',
            badgeClass: 'bg-blue-500 text-white',
            gradientFrom: 'from-sky-900',
            gradientTo: 'to-sky-950',
            productTags: ['UTILITY', 'GLASSLIGHT', 'ALTERNATIVE', 'PATROL', 'UNMARKED', 'LORE FRIENDLY', 'OPTIMISÉ'],
            details: 'Fourgon intercepteur police avec équipement glasslight et configuration banalisée. SUV utilitaire polyvalent pour patrouilles lourdes et transport d\'équipement.',
            features: [
                '✅ SUV utilitaire police',
                '✅ Glasslight intégrée',
                '✅ Configuration banalisée',
                '✅ Grande capacité',
                '✅ Handling robuste',
                '✅ Intérieur équipé',
                '✅ Extras configurables',
                '✅ Polyvalent RP'
            ],
            technicalDetails: {
                'Spawn Name': 'utilitypolice',
                'Poly Count': '102,450',
                'Vertices': '78,920',
                'YFT Size': '2.35 MB',
                'YTD Size': '315 KB'
            },
            importantInfo: [
                'Glasslight discrète pour opérations mixtes',
                'Grande capacité pour équipement tactique',
                'Parfait pour unités spécialisées',
                'Installation avec guide glasslight'
            ],
            images: []
        },
        {
            id: 'car-police-7',
            category: 'cars',
            tag: 'police',
            policeSubcategory: 'non-els-unmarked',
            title: 'Police Explorer NON-ELS',
            subtitle: 'POLICE - NON-ELS UNMARKED',
            description: 'SUV police banalisé sans sirènes ELS pour missions discrètes.',
            price: 17.99,
            badge: 'POLICE',
            badgeClass: 'bg-blue-500 text-white',
            gradientFrom: 'from-blue-800',
            gradientTo: 'to-blue-900',
            productTags: ['SUV', 'NON-ELS', 'UNMARKED', 'ADVANCED', 'LORE FRIENDLY', 'OPTIMISÉ'],
            details: 'Explorateur SUV police banalisé pour missions discrètes avancées. Ford Explorer haute performance avec apparence civile et équipement police caché.',
            features: [
                '✅ SUV Explorer premium',
                '✅ Banalisé 100% civil',
                '✅ Sans système ELS',
                '✅ Haute performance',
                '✅ Grande capacité',
                '✅ Équipement caché',
                '✅ Missions avancées',
                '✅ Handling SUV optimisé'
            ],
            technicalDetails: {
                'Spawn Name': 'explorerpolice',
                'Poly Count': '98,720',
                'Vertices': '74,380',
                'YFT Size': '2.22 MB',
                'YTD Size': '290 KB'
            },
            importantInfo: [
                'SUV haute performance pour unités spéciales',
                'Apparence totalement civile',
                'Pas de configuration ELS nécessaire',
                'Idéal pour détectives et unités undercover'
            ],
            images: []
        }
    ],
    scripts: [
        // Exemple de produit (décommenter pour ajouter) :
        /*
        {
            id: 'script-xx',
            category: 'scripts',
            title: 'Nom du script',
            subtitle: 'SOUS-TITRE',
            description: 'Courte description.',
            price: 0.00,
            gradientFrom: 'from-color-900',
            gradientTo: 'to-color-950',
            details: 'Détails dans la modale.',
            features: ['Fonctionnalité 1', 'Fonctionnalité 2']
        },
        */
        {
            id: 'script-1',
            category: 'scripts',
            title: 'Advanced Garage System',
            subtitle: 'SYSTÈME COMPLET',
            description: 'Système de garage avancé avec multi-véhicules et personnalisation totale.',
            price: 24.99,
            badge: 'NOUVEAU',
            badgeClass: 'product-badge',
            gradientFrom: 'from-green-900',
            gradientTo: 'to-green-950',
            details: 'Système de garage complet avec stockage illimité de véhicules, customisation 3D temps réel, gestion d\'assurance et système de location. Compatible ESX et QBCore.',
            features: ['Multi-garage support', 'Customisation 3D', 'Système assurance', 'Location véhicules', 'Support ESX/QBCore'],
            fileSize: '1.2 MB',
            version: '2.3',
            type: 'Lua script'
        },
        {
            id: 'script-2',
            category: 'scripts',
            title: 'Phone System Pro',
            subtitle: 'APPLICATION COMPLÈTE',
            description: 'Système téléphone complet avec apps, messages, appels et notifications.',
            price: 34.99,
            badge: 'BEST',
            badgeClass: 'bg-purple-500 text-white',
            gradientFrom: 'from-blue-900',
            gradientTo: 'to-blue-950',
            details: 'Téléphone complet avec 15+ apps intégrées : messages, appels, banque, location immobilière, emplois, marketplace. Design moderne, 4K optimisé, multijoueur synchronisé.',
            features: ['15+ applications', 'Système messaging', 'Appels multijoueurs', 'Banque intégrée', 'Design modern UI'],
            fileSize: '2.4 MB',
            version: '1.8',
            type: 'Lua script'
        },
        {
            id: 'script-3',
            category: 'scripts',
            title: 'Banking Script',
            subtitle: 'SYSTÈME BANCAIRE',
            description: 'Script bancaire avec transferts, prêts et gestion de compte complète.',
            price: 18.99,
            gradientFrom: 'from-cyan-900',
            gradientTo: 'to-cyan-950',
            details: 'Système bancaire complet avec comptes multiples, transferts bancaires, prêts immobiliers et automobiles, cartes bancaires virtuelles, et rapports financiers détaillés. Compatible ESX et QBCore.',
            features: [
                '✅ Comptes bancaires multiples',
                '✅ Transferts bancaires sécurisés',
                '✅ Système de prêts avancé',
                '✅ Cartes bancaires virtuelles',
                '✅ Rapports financiers détaillés',
                '✅ Interface UI moderne',
                '✅ Historique transactions',
                '✅ Support ESX/QBCore'
            ],
            technicalDetails: {
                'Framework': 'ESX / QBCore',
                'Version': '3.1',
                'Type': 'Lua script',
                'Taille du fichier': '1.8 MB',
                'Documentation': 'FR/EN incluse'
            },
            importantInfo: [
                'Système bancaire complet pour serveur RP',
                'Configuration facile via fichier config',
                'Compatible tous les scripts économiques',
                'Mises à jour et support technique inclus'
            ],
            fileSize: '1.8 MB',
            version: '3.1',
            type: 'Lua script',
            images: []
        },
        {
            id: 'script-4',
            category: 'scripts',
            title: 'Job System Framework',
            subtitle: 'SYSTÈME D\'EMPLOIS',
            description: 'Framework complet pour créer et gérer des employeurs et emplois RP.',
            price: 21.99,
            badge: 'NOUVEAU',
            badgeClass: 'product-badge',
            gradientFrom: 'from-orange-900',
            gradientTo: 'to-orange-950',
            details: 'Framework d\'emplois modulable avec salaires, grades, uniformes et missions. Compatible ESX et QBCore avec système de congés et promotions.',
            features: ['Emplois modulables', 'Système grades', 'Missions RP', 'Salaires dynamiques', 'Support multi-framework'],
            fileSize: '850 KB',
            version: '1.5',
            type: 'Lua script'
        },
        {
            id: 'script-5',
            category: 'scripts',
            title: 'House Robbery Script',
            subtitle: 'CAMBRIOLAGES',
            description: 'Script de cambriolage maison avec alarmes, butins et risques.',
            price: 19.99,
            gradientFrom: 'from-red-900',
            gradientTo: 'to-red-950',
            details: 'Système complet de cambriolage avec alarmes, caméras, pénalités et butins variés. Inclut animations et interactions réalistes pour une expérience RP immersive.',
            features: [
                '✅ Alarmes intégrées configurable',
                '✅ Caméras de surveillance',
                '✅ Butins variés aléatoires',
                '✅ Pénalités policières dynamiques',
                '✅ Animations réalistes complètes',
                '✅ Système de risque avancé',
                '✅ Multi-maisons support',
                '✅ Interface minimaliste'
            ],
            technicalDetails: {
                'Framework': 'ESX / QBCore / Standalone',
                'Version': '2.1',
                'Type': 'Lua script',
                'Taille du fichier': '920 KB',
                'Documentation': 'FR/EN incluse'
            },
            importantInfo: [
                'Script de cambriolage le plus réaliste',
                'Système d\'alarme et caméra intégré',
                'Configuration par maison personnalisable',
                'Compatible tous frameworks majeurs'
            ],
            fileSize: '920 KB',
            version: '2.1',
            type: 'Lua script',
            images: []
        }
    ],
    clothes: [
        // Exemple de produit (décommenter pour ajouter) :
        /*
        {
            id: 'clothes-xx',
            category: 'clothes',
            title: 'Titre du pack',
            subtitle: 'SOUS-TITRE',
            description: 'Courte description.',
            price: 0.00,
            originalPrice: 0.00, // facultatif si promo
            badge: 'PROMO',
            badgeClass: 'bg-color text-white',
            gradientFrom: 'from-color-900',
            gradientTo: 'to-color-950',
            details: 'Détails du contenu.',
            features: ['Article 1', 'Article 2']
        },
        */
        {
            id: 'clothes-1',
            category: 'clothes',
            title: 'Street Pack Vol.3',
            subtitle: 'COLLECTION URBAINE',
            description: 'Collection de 50+ vêtements streetwear haute qualité et tendance.',
            price: 14.99,
            originalPrice: 19.99,
            badge: 'PROMO',
            badgeClass: 'bg-green-500 text-white',
            gradientFrom: 'from-pink-900',
            gradientTo: 'to-pink-950',
            details: '50+ outfits streetwear authentiques : hoodies, joggers, chaussures, accessoires. Texture haute qualité, animations naturelles, compatible tous les personnages.',
            features: ['50+ vêtements', 'Hoodies et joggers', 'Chaussures incluses', 'Accessoires', 'Tous personnages'],
            gender: 'Unisex',
            fileSize: '250 MB',
            style: 'Streetwear'
        },
        {
            id: 'clothes-2',
            category: 'clothes',
            title: 'Luxury Fashion',
            subtitle: 'COLLECTION PREMIUM',
            description: 'Vêtements de luxe avec designs exclusifs et matériaux haut de gamme.',
            price: 29.99,
            badge: 'BEST',
            badgeClass: 'bg-purple-500 text-white',
            gradientFrom: 'from-amber-900',
            gradientTo: 'to-amber-950',
            details: '30+ outfits de luxe exclusifs : Gucci, Louis Vuitton, Prada. Texture 4K, animations réalistes, détails précis, incomparables en jeu.',
            features: ['30+ outfits luxe', 'Marques prestige', 'Texture 4K', 'Animations réalistes', 'Détails précis'],
            gender: 'Homme/Femme',
            fileSize: '320 MB',
            style: 'Haute couture'
        },
        {
            id: 'clothes-3',
            category: 'clothes',
            title: 'Biker Outfit Pack',
            subtitle: 'COLLECTION MOTARD',
            description: '40+ vêtements style biker avec cuirs, chaînes et accessoires authentiques.',
            price: 16.99,
            originalPrice: 22.99,
            badge: 'PROMO',
            badgeClass: 'bg-red-500 text-white',
            gradientFrom: 'from-slate-900',
            gradientTo: 'to-slate-950',
            details: 'Pack complet motard : vestes cuir, jeans déchirés, bottes, chaînes, tattoos. Texture haute qualité, animations réalistes, style authentique gang RP.',
            features: ['40+ vêtements motard', 'Vestes cuir', 'Chaînes et accessoires', 'Tattoos inclus', 'Style authentique'],
            gender: 'Homme/Femme',
            fileSize: '280 MB',
            style: 'Biker'
        },
        {
            id: 'clothes-4',
            category: 'clothes',
            title: 'Business Formal Pack',
            subtitle: 'COLLECTION BUSINESS',
            description: '35+ tenues formelles et business pour roleplay professionnel.',
            price: 12.99,
            gradientFrom: 'from-slate-800',
            gradientTo: 'to-slate-900',
            details: 'Collection professionnelle avec costumes, robes, chemises blanches, cravates et accessoires business. Parfait pour avocats, agents immobiliers, hommes d\'affaires.',
            features: ['35+ tenues business', 'Costumes premium', 'Robes formelles', 'Accessoires inclus', 'Tous genres'],
            gender: 'Homme/Femme',
            fileSize: '240 MB',
            style: 'Business formel'
        }
    ],
    templates: [
        // Exemple de produit (décommenter pour ajouter) :
        /*
        {
            id: 'template-xx',
            category: 'templates',
            title: 'Nom du template',
            subtitle: 'SOUS-TITRE',
            description: 'Courte description.',
            price: 0.00,
            gradientFrom: 'from-color-900',
            gradientTo: 'to-color-950',
            details: 'Détails du template.',
            features: ['Caractéristique 1', 'Caractéristique 2']
        },
        */
        {
            id: 'template-1',
            category: 'templates',
            title: 'Discord Bot Dashboard',
            subtitle: 'DASHBOARD BOT',
            description: 'Template complet pour dashboard de bot Discord moderne et réactif.',
            price: 9.99,
            gradientFrom: 'from-violet-900',
            gradientTo: 'to-violet-950',
            details: 'Dashboard Discord complet avec panel admin, gestion des rôles, statistiques serveur, logs modulables. React moderne, authentification Discord OAuth2.',
            features: ['Panel admin complet', 'Gestion rôles', 'Statistiques', 'Discord OAuth2', 'Design moderne'],
            fileSize: '600 KB',
            style: 'React UI'
        },
        {
            id: 'template-2',
            category: 'templates',
            title: 'Admin Panel UI Kit',
            subtitle: 'KIT D\'INTERFACE',
            description: 'Collection d\'interfaces administratives élégantes prêtes à l\'emploi.',
            price: 7.49,
            gradientFrom: 'from-indigo-900',
            gradientTo: 'to-indigo-950',
            details: 'UI kit complet avec tableaux de bord, graphiques, formulaires et composants réactifs. Convient pour tout projet web admin avec design moderne et performances optimisées.',
            features: [
                '✅ Dashboards interactifs multiples',
                '✅ Formulaires personnalisables',
                '✅ Composants réactifs modernes',
                '✅ Thème sombre et clair',
                '✅ Graphiques et statistiques',
                '✅ Tables de données avancées',
                '✅ Navigation responsive',
                '✅ Documentation complète'
            ],
            technicalDetails: {
                'Stack': 'Bootstrap 5 / JS',
                'Responsive': 'Desktop + Mobile + Tablet',
                'Taille du fichier': '450 KB',
                'Integration': 'Simple et rapide',
                'Documentation': 'Guide complet inclus'
            },
            importantInfo: [
                'UI kit professionnel pour admin panels',
                'Plus de 50 composants pré-développés',
                'Compatible tous navigateurs modernes',
                'Mises à jour gratuites à vie'
            ],
            fileSize: '450 KB',
            style: 'Bootstrap UI',
            images: []
        },
        {
            id: 'template-3',
            category: 'templates',
            title: 'Community Website Builder',
            subtitle: 'WEBSITE BUILDER',
            description: 'Template complet pour créer un site web de communauté gaming moderne.',
            price: 19.99,
            badge: 'NOUVEAU',
            badgeClass: 'product-badge',
            gradientFrom: 'from-purple-900',
            gradientTo: 'to-purple-950',
            details: 'Template responsif complet avec forum, galerie, membres, événements. Système de modération intégré et statistiques en temps réel pour votre communauté gaming.',
            features: [
                '✅ Forum intégré complet',
                '✅ Galerie images responsive',
                '✅ Profils membres personnalisables',
                '✅ Calendrier événements',
                '✅ Système de modération',
                '✅ Statistiques temps réel',
                '✅ Intégration Discord',
                '✅ Panneau admin puissant'
            ],
            technicalDetails: {
                'Stack': 'React / Node.js / MongoDB',
                'Responsive': 'Desktop + Mobile + Tablet',
                'Taille du fichier': '3.2 MB',
                'Integration': 'Guide détaillé inclus',
                'Documentation': 'FR/EN complète'
            },
            importantInfo: [
                'Solution complète pour communauté gaming',
                'Backend Node.js et Base de données inclus',
                'Personnalisation facile sans codage avancé',
                'Support et mises à jour inclus 6 mois'
            ],
            fileSize: '3.2 MB',
            style: 'React Full-Stack',
            images: []
        },
        {
            id: 'template-4',
            category: 'templates',
            title: 'E-Commerce Shop Template',
            subtitle: 'SHOP MODERNE',
            description: 'Template e-commerce complet avec panier, paiement et gestion produits.',
            price: 24.99,
            gradientFrom: 'from-emerald-900',
            gradientTo: 'to-emerald-950',
            details: 'Template boutique complète avec système de paiement Stripe, gestion stock, avis clients, wishlist et recommandations IA. Solution professionnelle pour vendre en ligne.',
            features: [
                '✅ Panier avancé temps réel',
                '✅ Paiement sécurisé Stripe',
                '✅ Gestion stock automatisée',
                '✅ Système avis clients',
                '✅ Recommandations IA',
                '✅ Wishlist utilisateur',
                '✅ Tableau de bord vendeur',
                '✅ Multi-devises support'
            ],
            technicalDetails: {
                'Stack': 'Next.js / Stripe / PostgreSQL',
                'Responsive': 'Desktop + Mobile + Tablet',
                'Taille du fichier': '4.8 MB',
                'Integration': 'Guide installation détaillé',
                'Documentation': 'FR/EN complète'
            },
            importantInfo: [
                'Solution e-commerce professionnelle complète',
                'Intégration Stripe pour paiements sécurisés',
                'Base de données PostgreSQL incluse',
                'Support technique et mises à jour 1 an'
            ],
            fileSize: '4.8 MB',
            style: 'Next.js E-Commerce',
            images: []
        }
    ]
};

function estimatePackSizeByPrice(price, baseSize = 0.75, multiplier = 0.08) {
    const safePrice = Number.isFinite(price) ? price : 0;
    return `${(baseSize + safePrice * multiplier).toFixed(2)} MB`;
}

function buildTechnicalDetails(product) {
    switch (product.category) {
    case 'cars':
        return {
            'Spawn Name': (product.id || 'vehicle').replace(/-/g, '_'),
            'Optimisation': 'FiveM / OneSync',
            'LODs': '3 niveaux inclus',
            'Compatibilite': 'ESX, QBCore, Standalone',
            'Taille estimee': estimatePackSizeByPrice(product.price, 0.85, 0.07)
        };
    case 'scripts':
        return {
            'Framework': 'ESX / QBCore / Standalone',
            'Version': product.version || '1.0.0',
            'Type': product.type || 'Lua script',
            'Taille du fichier': product.fileSize || estimatePackSizeByPrice(product.price, 0.45, 0.05),
            'Documentation': 'FR/EN incluse'
        };
    case 'clothes':
        return {
            'Genre': product.gender || 'Unisex',
            'Style': product.style || 'Custom',
            'Taille du pack': product.fileSize || estimatePackSizeByPrice(product.price, 120, 5),
            'Compatibilite': 'FiveM Freemode',
            'Format': 'YDD / YTD'
        };
    case 'templates':
        return {
            'Stack': product.style || 'HTML / CSS / JS',
            'Responsive': 'Desktop + Mobile',
            'Taille du fichier': product.fileSize || estimatePackSizeByPrice(product.price, 0.35, 0.04),
            'Integration': 'Simple et rapide',
            'Documentation': 'Guide inclus'
        };
    default:
        return {
            'Compatibilite': 'FiveM',
            'Format': 'Standard',
            'Support': 'Inclus'
        };
    }
}

function buildImportantInfo(product) {
    switch (product.category) {
    case 'cars':
        return [
            'Compatible FiveM et tests en environnement RP',
            'Installation facile via resource server',
            'Utilisation reservee au roleplay (revente interdite)',
            'Support technique disponible en cas de besoin'
        ];
    case 'scripts':
        return [
            'Livre avec une documentation d installation',
            'Configuration possible sans modifier le coeur du script',
            'Mises a jour de maintenance incluses',
            'Support pour integration ESX, QBCore ou standalone'
        ];
    case 'clothes':
        return [
            'Compatible ped freemode homme et femme selon le pack',
            'Aucune marque reelle obligatoire pour rester lore friendly',
            'Optimise pour limiter l impact en jeu',
            'Aide a l installation incluse'
        ];
    case 'templates':
        return [
            'Template livre pret a deployer',
            'Code facilement personnalisable pour votre projet',
            'Compatible navigation desktop et mobile',
            'Support disponible pour prise en main initiale'
        ];
    default:
        return [
            'Produit pret a l emploi',
            'Documentation incluse',
            'Support disponible'
        ];
    }
}

// Ensure every product card has complete metadata for the product detail page.
Object.values(products).flat().forEach((product) => {
    if (!product.technicalDetails || Object.keys(product.technicalDetails).length === 0) {
        product.technicalDetails = buildTechnicalDetails(product);
    }

    if (!Array.isArray(product.importantInfo) || product.importantInfo.length === 0) {
        product.importantInfo = buildImportantInfo(product);
    }
});

// Promo Codes
const promoCodes = {
    WELCOME10: 0.10,
    PROMO20: 0.20,
    SUMMER15: 0.15,
    FIVEM25: 0.25
};

// Helper function to get all products
function getAllProducts() {
    return Object.values(products).flat();
}
