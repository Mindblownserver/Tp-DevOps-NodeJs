// Importer le modèle Etudiant
const Etudiant = require('../models/Etudiant');

// Les fonctions CRUD seront ajoutées ici...
// ============================================
// CREATE - Créer un nouvel étudiant
// ============================================
// Route:  POST /api/etudiants
// Cette fonction reçoit les données d'un étudiant dans le body
// de la requête et les enregistre dans la base de données.

exports.createEtudiant = async (req, res) => {
    try {
        console.log('📥 Données reçues:', req.body);

        // Verifier si etudiant avec le meme nom et prenom existe
        // Verifier si etudiant avec le meme nom et prenom existe
        const existe = await Etudiant.exists({ nom: req.body.nom, prenom: req.body.prenom})
        console.log(existe)
        if(existe){
            res.status(400).json({
                success: false,
                message: "Etudiant with name "+req.body.prenom +" "+req.body.nom+ " already existss",
            });
        }
        else{
            const etudiant = await Etudiant.create(req.body);


            res.status(201).json({
                success: true,
                message: 'Étudiant créé avec succès',
                data: etudiant
            });
            
        }
        

    } catch (error) {
        // Gestion des erreurs

        // Erreur de doublon (email déjà existant)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Cet email existe déjà'
            });
        }

        // Autres erreurs (validation, etc.)
        res.status(400).json({
            success: false,
            message: 'Données invalides',
            error: error.message
        });
    }
};

// ============================================
// READ ALL - Récupérer tous les étudiants
// ============================================
// Route: GET /api/etudiants
// Cette fonction retourne la liste complète des étudiants.

exports.getAllEtudiants = async (req, res) => {
    try {
        // Étape 1: Récupérer tous les documents de la collection
        // find() sans paramètre = tous les documents
        const etudiants = await Etudiant.find();

        // Étape 2: Renvoyer la liste avec le nombre total
        res.status(200).json({
            success: true,
            count: etudiants.length,  // Nombre d'étudiants trouvés
            data: etudiants
        });

    } catch (error) {
        // Erreur serveur (code 500)
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

// ============================================
// READ ONE - Récupérer un étudiant par son ID
// ============================================
// Route: GET /api/etudiants/:id
// Le : id dans l'URL est un paramètre dynamique.
// Exemple:  GET /api/etudiants/507f1f77bcf86cd799439011

exports.getEtudiantById = async (req, res) => {
    try {
        // Étape 1: Récupérer l'ID depuis les paramètres de l'URL
        // req.params contient les paramètres de l'URL
        console.log('🔍 Recherche de l\'ID:', req.params.id);

        // Étape 2: Chercher l'étudiant par son ID
        const etudiant = await Etudiant.findById(req.params.id);

        // Étape 3: Vérifier si l'étudiant existe
        if (!etudiant) {
            return res.status(404).json({
                success: false,
                message: 'Étudiant non trouvé'
            });
        }

        // Étape 4: Renvoyer l'étudiant trouvé
        res.status(200).json({
            success: true,
            data: etudiant
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
}

// ============================================
// UPDATE - Mettre à jour un étudiant
// ============================================
// Route: PUT /api/etudiants/:id
// Cette fonction modifie les champs d'un étudiant existant.

exports.updateEtudiant = async (req, res) => {
    try {
        console.log('✏️ Mise à jour de l\'ID:', req.params.id);
        console.log('📥 Nouvelles données:', req.body);

        // findByIdAndUpdate prend 3 arguments:
        // 1. L'ID du document à modifier
        // 2. Les nouvelles données
        // 3. Options:
        //    - new: true = retourne le document modifié (pas l'ancien)
        //    - runValidators: true = applique les validations du schéma

        const etudiant = await Etudiant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // Vérifier si l'étudiant existe
        if (!etudiant) {
            return res.status(404).json({
                success: false,
                message: 'Étudiant non trouvé'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Étudiant mis à jour avec succès',
            data: etudiant
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur de mise à jour',
            error: error.message
        });
    }
};

// ============================================
// DELETE - Supprimer un étudiant
// ============================================
// Route: DELETE /api/etudiants/:id
// Cette fonction supprime définitivement un étudiant.

exports.deleteEtudiant = async (req, res) => {
    try {
        console.log('🗑️ Suppression de l\'ID:', req.params.id);

        // Trouver et supprimer l'étudiant
        const etudiant = await Etudiant.findByIdAndDelete(req.params.id);

        // Vérifier si l'étudiant existait
        if (!etudiant) {
            return res.status(404).json({
                success: false,
                message: 'Étudiant non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Étudiant supprimé avec succès',
            data: {}  // On retourne un objet vide car l'étudiant n'existe plus
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error. message
        });
    }
};

// ============================================
// SEARCH - Rechercher des étudiants par filière
// ============================================
// Route:  GET /api/etudiants/filiere/:filiere
// Exemple: GET /api/etudiants/filiere/Informatique

exports.getEtudiantsByFiliere = async (req, res) => {
    try {
        console.log('🔎 Recherche par filière:', req.params.filiere);

        // Chercher tous les étudiants avec cette filière
        const etudiants = await Etudiant.find({ filiere: req.params.filiere });

        res.status(200).json({
            success: true,
            count: etudiants.length,
            filiere: req.params.filiere,
            data: etudiants
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error. message
        });
    }
};


exports.searchEtudiants = async (req, res)=>{
    try {
        console.log('🔎 Recherche par nom ou prenom:', req.query.q);
        
        const regex = new RegExp(req.query.q, 'i');
        // Chercher tous les étudiants avec cette filière
        const etudiants = await Etudiant.find({
            $or: [
                { nom: regex },
                { prenom: regex }
            ]
        });

        res.status(200).json({
            success: true,
            count: etudiants.length,
            filiere: req.params.filiere,
            data: etudiants
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error. message
        });
    }
}


exports.advancedSearch = async (req, res) => {                            
    // Recherche avancée avec filtres multiples                               
            const { nom, filiere, anneeMin, anneeMax, moyenneMin } = req.query;
        try {                                                                 
            let filter = { actif: true };                                     
                                                                              
            if (nom) filter.nom = new RegExp(nom, 'i');                       
            if (filiere) filter.filiere = filiere;                            
            if (anneeMin || anneeMax) {                                       
                filter.annee = {};                                            
                if (anneeMin) filter.annee.$gte = parseInt(anneeMin);         
                if (anneeMax) filter.annee.$lte = parseInt(anneeMax);         
            }                                                                 
            if (moyenneMin) filter.moyenne = { $gte: parseFloat(moyenneMin) };
                                                                              
            const etudiants = await Etudiant.find(filter);                    
                                                                              
            res.status(200).json({                                            
                success: true,                                                
                count: etudiants.length,                                      
                filters: req.query,                                           
                data: etudiants                                               
            });                                                               
        } catch (error) {                                                     
            res.status(500).json({                                            
                success: false,                                               
                message: 'Erreur serveur',                                    
                error: error.message                                          
            });                                                             
        }
    };

exports.getEtudiantsSorted= async(req,res)=>{
    // Retourne les étudiants triés par moyenne décroissante.
    // Options query (facultatif) :
    //   filiere - filtrer par filière
    //   limit   - nombre maximum de résultats
    //   page    - pagination (1-based)
    try {
        const { filiere, limit, page } = req.query;
        const filter = {};
        if (filiere) filter.filiere = filiere;

        const perPage = limit ? Math.max(parseInt(limit, 10), 0) : 0;
        const pageNum = page ? Math.max(parseInt(page, 10), 1) : 1;
        const skip = perPage ? perPage * (pageNum - 1) : 0;

        let query = Etudiant.find(filter).sort({ moyenne: -1 });
        if (perPage) query = query.limit(perPage).skip(skip);

        const etudiants = await query;
        res.status(200).json({
            success: true,
            count: etudiants.length,
            filters: req.query,
            data: etudiants
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
}