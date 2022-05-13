'use strict';

const socket = io('http://localhost:3000');

socket.on('Server-send-failed-register', ()=>{
    alert('Username already registered');
});

socket.on('Server-send-success-register', (data)=>{
    $('.currentUser').html(data);
    $('#loginForm').hide(1000);
    $('#chatForm').show(1000);
});

socket.on('Server-send-userList', (data)=>{
    $('#memberList').html('');
    data.forEach((user)=>{
        $('#memberList').append(`
            <div class="onlineMember">
                <span class="icon"></span>
                <span class="name">${user}</span>
            </div>
        `);
    });
});

socket.on('Server-send-message', (data)=>{
    $('.messageArea').append(`
        <div class="friendMessage">
            <div class="friendMessage__content">
                <span id="friendMessage">${data.username}: ${data.message}</span>
            </div>
        </div>
    `);
});

socket.on('Someone-typing', ()=>{
    $('.detect_typing').css('display', 'block');
});

socket.on('Someone-stop-typing', ()=>{
    $('.detect_typing').css('display', 'none');
});

$(document).ready(()=> {
    $('#loginForm').show();
    $('#chatForm').hide();

    $('#btnRegister').click(()=>{
        socket.emit('Client-send-register-data', $('#txtUsername').val());
        $('#txtUsername').val('');
    });

    $("#txtUsername").keypress(function(e) {
        let keyCode = (e.keyCode ? e.keyCode : e.which);
        if (keyCode == '13') {
            socket.emit('Client-send-register-data', $('#txtUsername').val());
            $('#txtUsername').val('');
        }
    });
    

    $('#btnLeave').click(()=>{
        socket.emit('logout');
        $('#chatForm').hide();
        $('#loginForm').show();
    });

    $('#sendMessage').focusin(()=>{
        socket.emit('start-typing-message');
    });

    $('#sendMessage').focusout(()=>{
        socket.emit('end-typing-message');
    });

    $('.sendMessageBtn').click(()=>{
        $('.messageArea').append(`
            <div class="myMessage">
                <div class="myMessage__content">
                    <span id="myMessage">${$('#sendMessage').val()}</span>
                </div>
            </div>
        `);
        socket.emit('User-send-message', $('#sendMessage').val());
        $('#sendMessage').val('');
    });

    $("#sendMessage").keypress(function(e) {
        let keyCode = (e.keyCode ? e.keyCode : e.which);
        if (keyCode == '13') {
            $('.messageArea').append(`
                <div class="myMessage">
                    <div class="myMessage__content">
                        <span id="myMessage">${$('#sendMessage').val()}</span>
                    </div>
                </div>
            `);
            socket.emit('User-send-message', $('#sendMessage').val());
            $('#sendMessage').val('');
        }
    });
});