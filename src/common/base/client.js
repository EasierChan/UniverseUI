"use strict";
var net = require('net');
var logger_1 = require('./logger');
var localhost = '127.0.0.1';
/**
 * TcpClient is
 */
var TcpClient = (function () {
    /**
     * resolver: Resolver的实例
     */
    function TcpClient(resolver) {
        this._resolver = resolver;
    }
    /**
     * 连接
     */
    TcpClient.prototype.connect = function (port, ip) {
        var _this = this;
        if (ip === void 0) { ip = localhost; }
        logger_1.DefaultLogger.info("start to connect to " + ip + ":" + port + "...");
        this._sock = null;
        this._sock = net.connect(port, ip, function (e) {
            _this._resolver.onConnected(e);
        });
        this._sock.on('error', function (err) {
            _this._resolver.onError(err);
        });
        this._sock.on('data', function (data) {
            _this._resolver.onData(data);
        });
        this._sock.on('end', function () {
            _this._resolver.onEnd({ remoteAddr: _this._sock.remoteAddress, remotePort: _this._sock.remotePort });
        });
        this._sock.on('close', function (had_error) {
            _this._resolver.onClose(had_error);
        });
        this._resolver.onResolved(this.onReceived);
    };
    /**
     * 发送数据
     */
    TcpClient.prototype.send = function (data) {
        if (this._sock.writable) {
            this._sock.write(data);
            return;
        }
        logger_1.DefaultLogger.error('connection is not writable.');
    };
    /**
     * 关闭连接
     */
    TcpClient.prototype.close = function () {
        if (this._sock.writable) {
            this._sock.end();
            return;
        }
    };
    TcpClient.prototype.onReceived = function (data) {
        //DefaultLogger.info(data);
    };
    return TcpClient;
}());
exports.TcpClient = TcpClient;
