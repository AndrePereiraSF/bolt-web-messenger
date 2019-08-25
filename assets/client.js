$(document).ready(() => {
    const socket = io.connect("http://localhost:3000");
    let ready = false;

    $('#submit').submit((e) => {
        e.preventDefault();
        let nick = $("#nickname").val().length;
        if (nick < 4) {
            $("#warning").text("Your nickname must have at least 4 characters.").effect("shake",
                { times: 2, direction: 'down', distance: 4 }, 400);
            return;
        }
        $('#nick').slideUp();
        $('#chat').slideDown();
        let name = $('#nickname').val()
        let time = new Date();
        $('#name').html(name);
        $('#time').html(`First login: ${time.getHours()}:${time.getMinutes() < 10 ? '0' : ''}${time.getMinutes()}h`);

        ready = true;
        socket.emit('join', name);
    });

    socket.on('update', (msg) => {
        if (ready) {
            $('.chat').append(`<li class="info">${msg}</li>`);
        }
    });

    $('#textarea').keypress((e) => {
        let msg = $('#textarea').val().length
        if (msg === 0) {
            return;
        }
        if (e.which == 13) {
            let text = $("#textarea").val();
            $('#textarea').val('');
            let time = new Date()
            $('.chat').append(`<li class="self">
                <div class="msg">
                <span>${$('#nickname').val()}</span>
                <p>${text}</p><time>${time.getHours()}:${time.getMinutes()}h
                </time></div></li>`);
            socket.emit("send", text);
        }
    })

    socket.on("chat", (client, msg) => {
        if (ready) {
            let time = new Date();
            $('.chat').append(`<li class="other"><div class="msg">
                <span>${client}</span><p>${msg}</p><time>
                ${time.getHours()}:${time.getMinutes()}</time>
                </div></li>`)
        }
    })
});