import {Button, Form, Col, Row, Image, Container, Table, Nav, NavDropdown,Navbar, FormControl} from 'react-bootstrap';
import React, { useState, Component, useRef, Fragment } from "react";
import TextField from '@mui/material/TextField';
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from '@mui/material/InputAdornment';
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { connect } from "react-redux"
import authSlice from "../../../redux/auth/auth.reducer";

import {
  increaseCounter,
  decreaseCounter,
} from "../../../redux/auth/auth.actions"

import { AiOutlineUser } from 'react-icons/ai';
import { HiOutlineKey } from 'react-icons/hi';
import { height } from '@mui/system';

const API_PATH = `http://${window.location.hostname}:8000/`;

const _tags = [
    {
      name: "Action",
      color: "red"
    },
    {
      name: "Romance",
      color: "purple"
    },
    {
      name: "Comedy",
      color: "orange"
    },
    {
      name: "Horror",
      color: "black"
    }
  ];

const getPercentage = (containerWidth, distanceMoved) => {
	return (distanceMoved / containerWidth) * 100;
};

const limitNumberWithinRange = (value, min, max) => {
	return Math.min(Math.max(value, min), max);
};

const nearestN = (N: number, number: number) => Math.ceil(number / N) * N;

const TagSection = ({name, color, width, onSliderSelect}) => {
	return (
		<div
			className="tag"
			style={{
				...styles.tag,
				background: color,
				width: width + "%",
                height: 5,
			}}
		>
			<span style={styles.tagText}>{name}</span>
			<span style={{ ...styles.tagText, fontSize: 12 }}>{width + "%"}</span>

			<div
				style={styles.sliderButton}
				onPointerDown={onSliderSelect}
				className="slider-button"
			>
				<img src={"https://assets.codepen.io/576444/slider-arrows.svg"} height={"1%"} />
			</div>
		</div>
	);
};

const Page4Slider =(props)=> {

	const [tags, setTags] = useState(
        [...props.currencies].map(c => {return {
            name: c.fullNamePair.replace('/Tether', ''),
            color: "white"
          }})
    );
	const TagSliderRef = useRef(null);

	return (	
		<div
			ref={TagSliderRef}
			style={{
				width: "100%",
				display: "flex",
				   backgroundColor:'transparent'
			}}
		>
			{tags.map((tag, index) => (
				<TagSection
					width={props.widths[index]}
					key={index}
					noSliderButton={index === tags.length - 1}
					name={tag.name}
					onSliderSelect={(e) => {
						e.preventDefault();
						document.body.style.cursor = "ew-resize";

						const startDragX = e.pageX;
						const sliderWidth = TagSliderRef.current.offsetWidth;

						const resize = (e: MouseEvent & TouchEvent) => {
							e.preventDefault();
							const endDragX = e.touches ? e.touches[0].pageX : e.pageX;
							const distanceMoved = endDragX - startDragX;
							const maxPercent = props.widths[index] + props.widths[index + 1];

							const percentageMoved = nearestN(1, getPercentage(sliderWidth, distanceMoved))
							// const percentageMoved = getPercentage(sliderWidth, distanceMoved);

							const _widths = props.widths.slice();

                            console.log(_widths)

							const prevPercentage = _widths[index];
							
							const newPercentage = prevPercentage + percentageMoved;
							const currentSectionWidth = limitNumberWithinRange(
								newPercentage,
								0,
								maxPercent
							);
							_widths[index] = currentSectionWidth;

							const nextSectionIndex = index + 1;

							const nextSectionNewPercentage =
								_widths[nextSectionIndex] - percentageMoved;
							const nextSectionWidth = limitNumberWithinRange(
								nextSectionNewPercentage,
								0,
								maxPercent
							);
							_widths[nextSectionIndex] = nextSectionWidth;

							if (tags.length > 2) {
								if (_widths[index] === 0) {
									_widths[nextSectionIndex] = maxPercent;
									_widths.splice(index, 1);
									setTags(tags.filter((t, i) => i !== index));
									removeEventListener();
								}
								if (_widths[nextSectionIndex] === 0) {
									_widths[index] = maxPercent;
									_widths.splice(nextSectionIndex, 1);
									setTags(tags.filter((t, i) => i !== nextSectionIndex));
									removeEventListener();
								}
							}

							props.setWidths(_widths);
						};

						window.addEventListener("pointermove", resize);
						window.addEventListener("touchmove", resize);

						const removeEventListener = () => {
							window.removeEventListener("pointermove", resize);
							window.removeEventListener("touchmove", resize);
						};

						const handleEventUp = (e: Event) => {
							e.preventDefault();
							document.body.style.cursor = "initial";
							removeEventListener();
						};

						window.addEventListener("touchend", handleEventUp);
						window.addEventListener("pointerup", handleEventUp);
					}}
					color={tag.color}
				/>
			))
			}
			{
				(props.available != 100)? (
					<TagSection
						width={100 - props.available}
						key={tags.length}
						noSliderButton={true}
						name={"none"}
						onSliderSelect={(e) => {}}
					/>
				) : (
					<div/>
				)	
			}
		</div>
    );
};

type StylesType = { [key: string]: React.CSSProperties };

const styles: StylesType = {
	tag: {
		paddingTop: 1,
        marginBottom: 50,
		textAlign: "center",
		position: "relative",
		borderRightWidth: ".1em",
		borderRightStyle: "solid",
		borderRightColor: "white",
		boxSizing: "border-box",
		borderLeftWidth: ".1em",
		borderLeftStyle: "solid",
		borderLeftColor: "white"
	},
	tagText: {
        paddingTop: 10,
		color: "white",
		fontWeight: 700,
		userSelect: "none",
		display: "block",
		overflow: "hidden",
	},
	sliderButton: {
		height: 10,
        width: 10,
		backgroundColor: "#fff",
        border: "1px solid currentColor",
        boxShadow: "#ebebeb 0 2px 2px",
        "&:focus, &:hover, &$active": {
            boxShadow: "#ccc 0 2px 3px 1px",
        },
        color: "#fff",
		position: "absolute",
		borderRadius: "2em",
		right: "calc(-0.2em)",
		top: 0,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		bottom: 0,
		margin: "auto",
		zIndex: 10,
		cursor: "ew-resize",
		userSelect: "none"
	}
};

export default Page4Slider