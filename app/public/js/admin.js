const deleteButtons = document.querySelectorAll('.btn-delete');

let deleteProduct = function() {
    const csurfToken = this.getAttribute('data-csurf');
    const productId = this.getAttribute('data-prodId');
    const parentArticle = this.closest('article.product-item');

    fetch(`/admin/delete-product/${productId}`, {
        method: 'DELETE',
        headers: {
            "csrf-token": csurfToken
        }
    })
    .then( resul => {
        return resul.json();
    })
    .then( data => {
        parentArticle.parentNode.removeChild(parentArticle);
    })
    .catch( err => {
        console.log(err)
    })
}

for( let btn of deleteButtons){
    btn.addEventListener("click", deleteProduct);
}