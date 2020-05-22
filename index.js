// Get the characters from the API
// and render them on the DOM

const getCharacters = () => {
  axios
    .get('https://ih-crud-api.herokuapp.com/characters')
    .then(response => {
      const data = response.data;
      console.log(data);

      let str = '';

      data.forEach(character => {
        str += `
            <li class="list-group-item">
                ID: ${character.id} - ${character.name}
                <span class="float-right">
                    <button class="btn btn-success" onclick="updateCharacter(${character.id})">Update</button>
                    <button class="btn btn-danger" onclick="deleteCharacter(${character.id})">Delete</button>
                </span>
            </li>`;
      });

      // insert characters in the list in the html
      document.getElementById('characters-list').innerHTML = str;
    })
    .catch(err => console.log(`Error while getting the list of characters: ${err}`));
};

// Automatically invoke the function so the list renders when the DOM is ready
getCharacters();

// Create a new character
document.getElementById('new-character-form').addEventListener('submit', event => {
  event.preventDefault(); // <= !!! Prevent the refresh
  console.log('form submit');
  const name = document.getElementById('name-input').value;
  const occupation = document.getElementById('occupation-input').value;
  const weapon = document.getElementById('weapon-input').value;

  const newCharacterInfo = {
    // name: name
    name,
    occupation,
    weapon
  };

  console.log('New character: ', newCharacterInfo);

  axios
    .post('https://ih-crud-api.herokuapp.com/characters', newCharacterInfo)
    // .then(() => {
    //   getCharacters();
    //   // Clear the form after submitting:
    //   document.getElementById('new-character-form').reset();
    // })
    .then(response => {
      const { name, id } = response.data;
      const newCharacterHtml = `
                 <li class="list-group-item">
                    ID: ${id} - ${name}
                    <span class="float-right">
                       <button class="btn btn-success" onclick="updateCharacter(${id})">Update</button>
                       <button class="btn btn-danger" onclick="deleteCharacter(${id})">Delete</button>
                    </span>
                  </li>`;

      document.getElementById('characters-list').innerHTML += newCharacterHtml;
      // Clear the form after submitting:
      document.getElementById('new-character-form').reset();
    })
    .catch(err => console.log(`Error while saving a new character: ${err}`));
});

// Update
// 1. step: get all the inputs from the update form

const charName = document.getElementById('update-name-input');
const charOccupation = document.getElementById('update-occupation-input');
const charWeapon = document.getElementById('update-weapon-input');
const charId = document.getElementById('char-id');

const updateCharacter = id => {
  axios
    .get(`https://ih-crud-api.herokuapp.com/characters/${id}`)
    .then(response => {
      const { id, name, occupation, weapon } = response.data;
      // prefill the form
      charName.value = name;
      charOccupation.value = occupation;
      charWeapon.value = weapon;
      charId.value = id;
      document.getElementById('update-form-div').style.display = 'block';
    })
    .catch(error => {
      error.response.status === 404 ? alert(`The id ${charId} doesn't exist.`) : alert('Server error! Sorry.');
      console.log('The error while getting a single character is: ', error.response);
    });
};
// document.getElementById('get-one-character-form').addEventListener('submit', event => {
//   event.preventDefault();

//   const charId = document.getElementById('id-input').value;

//   axios
//     .get(`https://ih-crud-api.herokuapp.com/characters/${charId}`)
//     .then(response => {
//       const { name, occupation, weapon } = response.data;
//       charName.value = name;
//       charOccupation.value = occupation;
//       charWeapon.value = weapon;
//       document.getElementById('update-form-div').style.display = 'block';
//     })
//     .catch(error => {
//       error.response.status === 404 ? alert(`The id ${charId} doesn't exist.`) : alert('Server error! Sorry.');
//       // clear the get the id  form
//       document.getElementById('get-one-character-form').reset();
//       console.log('The error while getting a single character is: ', error.response);
//     });
// });

// 2. step: actually, update the character

document.getElementById('update-character-form').addEventListener('submit', event => {
  event.preventDefault();
  const charId = document.getElementById('char-id').value;

  const updatedCharacter = {
    name: charName.value,
    occupation: charOccupation.value,
    weapon: charWeapon.value
  };
  axios
    .put(`https://ih-crud-api.herokuapp.com/characters/${charId}`, updatedCharacter)
    .then(response => {
      console.log(response);
      getCharacters();
      // clear the update form
      document.getElementById('update-character-form').reset();
      // hide the update form
      document.getElementById('update-form-div').style.display = 'none';
    })
    .catch(error => console.log(`Error while updating a character: ${error}`));
});

// Delete
const deleteCharacter = id => {
  // protect from deleting
  if (id == 1 || id == 2) {
    alert(`Character with id ${id} can't be deleted!`);
    return;
  }
  const toDelete = confirm('Are you sure you want to delete?');
  if (toDelete) {
    axios
      .delete(`https://ih-crud-api.herokuapp.com/characters/${id}`)
      .then(response => {
        alert(response.data);
        getCharacters();
      })
      .catch(err => console.log(`Err while deleting character: ${err}`));
  }
};
