<?php

    class database extends PDO {

        private $erreur = "";
        private $conn;
        private $db;

        public function __construct($dir) {
            if (!$this->conn) {
                try {
                    $this->db = new PDO('sqlite:'.$dir.'gameapp.db');
                    $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    $this->db->exec('SET NAMES utf8');
                    $this->conn = true;
                    return $this->conn;
                } catch (PDOException $e) {
                    $this->erreur = $e->getMessage();
                    $this->conn = false;
                    return $this->conn;
                }
            } else {
                return $this->conn = true;
            }
        }

        public function getDataBase() {
            return $this->db;
        }

        public function getErreur() {
            return $this->erreur;
        }

    }

?>