async function getData() {
    try {
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json();
        let body = document.getElementById('table_body');
        body.innerHTML = '';
        for (const post of posts) {
            let rowStyle = post.isDeleted ? 'text-decoration: line-through; color: gray;' : '';
            
            body.innerHTML += `<tr style="${rowStyle}">
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>
                    <input type='submit' value='Delete' onclick='Delete("${post.id}")'>
                </td>
            </tr>`
        }
    } catch (error) {
        console.log(error);
    }
}

async function Save() {
    let id = document.getElementById('txt_id').value;
    let title = document.getElementById('txt_title').value;
    let views = document.getElementById('txt_views').value;

    if (!id) {
        try {
            let res = await fetch('http://localhost:3000/posts');
            let posts = await res.json();
            
            let maxId = 0;
            if (posts.length > 0) {
                maxId = Math.max(...posts.map(p => parseInt(p.id)));
            }
            
            let newId = maxId + 1;

            let createRes = await fetch('http://localhost:3000/posts', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: newId.toString(), 
                    title: title,
                    views: views,
                    isDeleted: false 
                })
            });

            if (createRes.ok) {
                console.log("Thêm mới thành công");
                document.getElementById('txt_title').value = '';
                document.getElementById('txt_views').value = '';
                getData();
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        let checkRes = await fetch('http://localhost:3000/posts/' + id);
        if (checkRes.ok) {
            let res = await fetch('http://localhost:3000/posts/' + id, {
                method: 'PATCH', 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    views: views
                })
            });
            if (res.ok) {
                console.log("Cập nhật thành công");
                getData();
            }
        } else {
            alert("ID không tồn tại để cập nhật!");
        }
    }
}

async function Delete(id) {
    try {
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: 'PATCH', 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isDeleted: true
            })
        });

        if (res.ok) {
            console.log("Đã xoá mềm thành công");
            getData(); 
        }
    } catch (error) {
        console.log(error);
    }
}

getData();