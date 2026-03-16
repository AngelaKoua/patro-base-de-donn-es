// Test de la configuration Supabase
const supabase = require('./config/supabase');

async function testSupabaseConfig() {
  console.log('=== Test de la configuration Supabase ===\n');

  try {
    // 1. Test de connexion à la base de données
    console.log('1. Test de connexion à la base de données...');
    const { data, error } = await supabase
      .from('test_images')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Erreur de connexion:', error.message);
    } else {
      console.log('✅ Connexion à la base de données réussie');
    }

    // 2. Test d'accès au Storage
    console.log('\n2. Test d\'accès au Storage...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error('❌ Erreur d\'accès au Storage:', bucketsError.message);
    } else {
      console.log('✅ Accès au Storage réussi');
      console.log('Buckets disponibles:', buckets.map(b => b.name).join(', '));
      
      // Vérifier si le bucket 'images' existe
      const imagesBucket = buckets.find(b => b.name === 'images');
      if (imagesBucket) {
        console.log('✅ Le bucket "images" existe');
        console.log('   Public:', imagesBucket.public);
      } else {
        console.log('⚠️  Le bucket "images" n\'existe pas. Veuillez le créer dans Supabase.');
      }
    }

    // 3. Test de lecture dans le bucket images
    console.log('\n3. Test de lecture dans le bucket images...');
    const { data: files, error: filesError } = await supabase.storage
      .from('images')
      .list('test-images', {
        limit: 5,
      });

    if (filesError) {
      console.error('❌ Erreur de lecture du bucket:', filesError.message);
    } else {
      console.log('✅ Lecture du bucket réussie');
      console.log(`   Nombre de fichiers dans test-images: ${files.length}`);
    }

    console.log('\n=== Test terminé ===');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Exécuter le test
testSupabaseConfig();
