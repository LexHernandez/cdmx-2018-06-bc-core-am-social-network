// Initialize Firebase
let config = {
  apiKey: 'AIzaSyBaECVsMzOMbR75yky-nvW0-WYpnXv7E88',
  authDomain: 'post-cloud.firebaseapp.com',
  projectId: 'post-cloud'
};
firebase.initializeApp(config);
let db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

const addPost = (comment) => {
  let likes = 0;
  db.collection('posts').add({
    post: comment,
    reaction: likes
  })
    .then(function(docRef) {
      console.log('Document written with ID: ', docRef.id);
      document.getElementById('post').value = '';
    })
    .catch(function(error) {
      console.error('Error adding document: ', error);
    });
};

db.collection('posts').onSnapshot((querySnapshot) => {
  document.getElementById('finalWall').innerHTML = '';
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data().post}`);
    finalWall.innerHTML += `<div class="card col-sm-10 col-md-8">
        <div class="card-body">
            <p>${doc.data().post}</p>
            <p id="likess"></p>
            <button id="deleteComment" onclick="deletePost('${doc.id}')">Borrar</button>
            <button id="editComment" onclick="editPost('${doc.id}', '${doc.data().post}')">Editar</button>
            <button id="like" onclick="likePost('${doc.id}', '${doc.reaction}')">Like</button>
        </div>
    </div>`;
  });
});

// Borrar datos
const deletePost = (id) => {
  db.collection('posts').doc(id).delete().then(function() {
    console.log('Document successfully deleted!');
  }).catch(function(error) {
    console.error('Error removing document: ', error);
  });
};

const editPost = (id, comment) => {
  document.getElementById('post').value = comment;
  let buttonEdit = document.getElementById('toPost');
  buttonEdit.innerHTML = 'Guardar';
  buttonEdit.addEventListener('click', event => {
    let postRef = db.collection('posts').doc(id);
    let comment = document.getElementById('post').value;
    return postRef.update({
      post: comment
    })
      .then(function() {
        console.log('Document successfully updated!');
        buttonEdit.innerHTML = 'Publicar';
        document.getElementById('post').value = '';
      })
      .catch(function(error) {
        console.error('Error updating document: ', error);
      });
  });
};

let contLike = false;
const likePost = (id, likes) => {
  if (contLike === true) {
    contLike = false;
    document.getElementById('like').innerHTML = 'Like';
    document.getElementById('likess').innerHTML = contLike;
  } else {
    contLike = true;
    document.getElementById('like').innerHTML = 'Dislike';
    document.getElementById('likess').innerHTML = contLike;
  }
};

window.close = {
  logOut: () => {
    firebase.auth().signOut().then(function() {
      console.log('Saliendo...');
      location.assign('newUser.html');    
    }).catch(function(error) {
      console.log(error);    
    });
  }
};